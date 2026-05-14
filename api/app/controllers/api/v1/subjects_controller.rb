module Api
  module V1
    class SubjectsController < ApplicationController
      def index
        if params[:search].present?
          subjects = Subject.search(params[:search])
          render json: subjects.map { |s| { id: s.id, name: s.name } }
        else
          render json: []
        end
      end

      def show
        subject = Subject.find(params[:id])
        render json: {
          id: subject.id,
          name: subject.name,
          average_score: subject.average_score
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Subject not found" }, status: :not_found
      end

      def create
        subject = Subject.new(subject_params)
        if subject.save
          render json: { id: subject.id, name: subject.name }, status: :created
        else
          render json: { errors: subject.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def subject_params
        params.require(:subject).permit(:name)
      end
    end
  end
end
