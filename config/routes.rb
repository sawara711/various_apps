Rails.application.routes.draw do
  root to: 'home#index'

  resources :home
  resources :patterns
end
