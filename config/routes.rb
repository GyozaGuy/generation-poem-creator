Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get 'lookup', to: 'translation#index'
  root to: 'home#index'
end
