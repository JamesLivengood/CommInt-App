origins = if Rails.env.production?
  ENV.fetch("CORS_ORIGINS", "").split(",").map(&:strip)
else
  ["http://localhost:5173", "http://localhost:3001"]
end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*origins)

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
