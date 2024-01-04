import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { DateQuery } from './validators/DateQuery';
import { FetchTopNUsersQuery } from './validators/FetchTopNUsersQuery';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // /avg-trans-amt : Compute the average transaction amount.
  @Get('/avg-trans-amt')
  async averageTransactionAmount(): Promise<{ average: number }> {
    const average = await this.appService.getAverageTransactionAmount();
    return { average: average };
  }

  // /all-trans: Allow the user to input a specific date and retrieve all transactions that occurred on that date.
  @Get('/all-trans')
  async fetchTransactionsByDate(@Query() fetchTransactionsQuery: DateQuery) {
    const transactions = await this.appService.getTransactionsByDate(
      fetchTransactionsQuery.date,
    );
    return { data: transactions };
  }

  // /top-users: Find the top N users who have transferred the highest total amount in a month.
  @Get('/top-users')
  async fetchTopNUsers(@Query() fetchTopNUsersQuery: FetchTopNUsersQuery) {
    const topNUsers = await this.appService.findTopNUsers(
      fetchTopNUsersQuery.month,
      fetchTopNUsersQuery.year,
      fetchTopNUsersQuery.n,
    );
    return { data: topNUsers };
  }

  // /potential-users: Identify users whose number of transactions has increased over the last month compared to the previous month.
  @Get('/potential-users')
  async potentialUsers() {
    const userIds = await this.appService.getPotentialUsers();
    return { potentialUserIds: userIds };
  }

  // /hightest-trans-hour: Find the hour of the day with the highest total transaction amount. Consider both peak hours and non-peak hours.
  @Get('/hightest-trans-hour')
  async getHighestTransHour(@Query() dateQuery: DateQuery) {
    const highestHour = await this.appService.highestTransHour(dateQuery.date);
    return highestHour;
  }

  // /loyalty-score: Calculate a loyalty score for each user based on the number of transactions and the total amount transferred. Define a formula that considers both frequency and monetary aspects.
  @Get('/loyalty-score')
  async getLoyaltyScore() {
    const loyaltyScore = await this.appService.getLoyaltyScore();
    return { data: loyaltyScore };
  }
}
