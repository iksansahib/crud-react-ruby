class UserController < ApplicationController

	def index
		users = User.page(params[:page]).per(params[:row_per_page])
		respond_to do |format|
			format.json {
				render json: {users: users, count: User.count}
			}
		end
	end

	def create
		User.create(resource_params)
		user = User.all()
		render json: user
	end

	def show
		users = User.find(params[:id])
		render json:users
	end

	def update
		user = User.find(params[:id])
		user.update(resource_params)
		users = User.all()
		render json: users
	end

	def destroy
		user = User.find(params[:id])
		user.delete()
		users = User.all()
		render json: users
	end

	private

	def resource_params
		params.require(:user).permit(:id, :name, :email_address, :phone)
	end
end