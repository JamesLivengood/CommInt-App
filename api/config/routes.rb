Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :subjects, only: [ :index, :show, :create ] do
        resources :ratings, only: [ :index, :create ]
      end
    end
  end
end
