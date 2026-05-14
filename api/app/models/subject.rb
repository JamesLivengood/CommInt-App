class Subject < ApplicationRecord
  has_many :ratings, dependent: :destroy

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  scope :search, ->(query) { where("name ILIKE ?", "%#{query}%").order(:name).limit(10) }

  def average_score
    ratings.average(:score)&.to_f&.round(1)
  end
end
