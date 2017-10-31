class UserController < ApplicationController
	def index
		users = User.all
		render json:users
	end

	def create
		User.create(resource_params)
		user = User.all()
		render json: user
	end

	private

	def resource_params
		params.require(:user).permit(:name, :email_address, :phone)
	end
end