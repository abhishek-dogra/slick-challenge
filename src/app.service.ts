import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAverageTransactionAmount() {
    const insertStatement = `select avg(t.amount) as average_amount from slick_challenge.transactions t;`;
    const averageAmount = (await this.dataSource.query(insertStatement)) as {
      average_amount: number;
    }[];
    return Number(averageAmount[0].average_amount);
  }

  async getTransactionsByDate(date: string) {
    const selectStatement = `select * from slick_challenge.transactions t where t.timestamp::date = $1::date;`;
    const transactions = (await this.dataSource.query(selectStatement, [
      date,
    ])) as {
      id: number;
      user_id: number;
      amount: number;
      timestamp: number;
    }[];
    return transactions;
  }

  async findTopNUsers(month: number, year: number, n: number) {
    const monthString: string = this.padMonth(month);
    const startDate = `${year}-${monthString}-01`;
    const selectStatement = `select user_id, sum(amount) as total_amount 
                              from slick_challenge.transactions t 
                              where 
                              "timestamp" >= $1::date 
                              and "timestamp" < $1::date + interval '1 month'
                              group by user_id 
                              order by total_amount 
                              desc limit $2;`;
    const topNUsers = (await this.dataSource.query(selectStatement, [
      startDate,
      n,
    ])) as {
      user_id: number;
      total_amount: number;
    }[];
    return topNUsers;
  }

  async highestTransHour(date: string) {
    const selectStatement = `select EXTRACT(HOUR FROM t.timestamp) as day_hour,sum(t.amount) as total_amount 
                            from slick_challenge.transactions t 
                            where 
                            t.timestamp::date = $1
                            group by EXTRACT(HOUR FROM t.timestamp) 
                            order by total_amount 
                            desc limit 1;`;
    const highestTransHour = (await this.dataSource.query(selectStatement, [
      date,
    ])) as {
      day_hour: number;
      total_amount: number;
    }[];
    if (highestTransHour == null || highestTransHour.length == 0) {
      throw new HttpException(
        { message: 'no entries found for highest transaction hour.' },
        HttpStatus.NOT_FOUND,
      );
    }
    return highestTransHour.at(0);
  }

  async getPotentialUsers() {
    const selectStatement = `select uc1.user_id from 
                              (
                                select user_id, count(*) from slick_challenge.transactions t1
                                where EXTRACT(year FROM t1.timestamp) = EXTRACT(year FROM now()) 
                                and EXTRACT(month FROM t1.timestamp) = EXTRACT(month FROM now())
                                group by user_id
                              ) uc1
                              join 
                              (
                                select user_id,count(*) from slick_challenge.transactions t2
                                where EXTRACT(year FROM t2.timestamp) = EXTRACT(year FROM now()-interval '1 month') 
                                and EXTRACT(month FROM t2.timestamp) = EXTRACT(month FROM now()-interval '1 month')
                                group by user_id
                              ) uc2
                              on uc1.user_id = uc2.user_id
                              where uc1.count>uc2.count
                              ;`;
    const potentitalUsers = (await this.dataSource.query(selectStatement)) as {
      user_id: number;
    }[];
    return potentitalUsers.map((userIdList) => {
      return userIdList.user_id;
    });
  }

  async getLoyaltyScore() {
    const selectStatement = `select user_id,count(*)*sum(amount) as loyalty_score
from slick_challenge.transactions t group by user_id limit 10000;`;
    const loyaltyScore = (await this.dataSource.query(selectStatement)) as {
      user_id: number;
      loyalty_score: number;
    }[];
    return loyaltyScore;
  }

  private padMonth(month: number) {
    if (month < 10) {
      return `0${month}`;
    }
    return `${month}`;
  }
}
