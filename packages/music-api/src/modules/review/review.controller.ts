import { Body, Controller, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SearchReviewDto } from './dtos/search.dto';
import { CreateReviewDto } from './dtos/create.dto';
import { SubmitReviewDto } from './dtos/submit.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('search')
  async searchReview(@Body() searchDto: SearchReviewDto) {
    return this.reviewService.search(searchDto);
  }

  @Post('create')
  async createReview(@Body() createDto: CreateReviewDto) {
    return this.reviewService.create(createDto);
  }

  @Post('submit')
  async submitReview(@Body() submitDto: SubmitReviewDto) {
    return this.reviewService.submit(submitDto);
  }

  @Post('reject')
  async rejectReview(@Body() rejectDto: SubmitReviewDto) {
    return this.reviewService.reject(rejectDto);
  }
}
