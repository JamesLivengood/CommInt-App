module Api
  module V1
    class RatingsController < ApplicationController
      PER_PAGE = 10

      def index
        subject = Subject.find(params[:subject_id])
        page = (params[:page] || 1).to_i
        total = subject.ratings.count
        ratings = subject.ratings.order(created_at: :desc).offset((page - 1) * PER_PAGE).limit(PER_PAGE)

        render json: {
          ratings: ratings.map { |r| { id: r.id, score: r.score, comment: r.comment, created_at: r.created_at } },
          pagination: {
            current_page: page,
            total_pages: (total / PER_PAGE.to_f).ceil,
            total_count: total
          }
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Subject not found" }, status: :not_found
      end

      def create
        subject = Subject.find(params[:subject_id])
        rating = subject.ratings.new(rating_params)
        if rating.save
          render json: { id: rating.id, score: rating.score, comment: rating.comment, created_at: rating.created_at }, status: :created
        else
          render json: { errors: rating.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Subject not found" }, status: :not_found
      end

      private

      def rating_params
        params.require(:rating).permit(:score, :comment)
      end
    end
  end
end
