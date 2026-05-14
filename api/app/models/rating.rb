class Rating < ApplicationRecord
  belongs_to :subject

  validates :score, presence: true, inclusion: { in: 1..5 }
  validates :comment, presence: true
end
