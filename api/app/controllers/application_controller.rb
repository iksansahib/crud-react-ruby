class ApplicationController < ActionController::API
include ActionController::MimeResponds
	respond_to :json, :html
end
