# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create(
	[
		{
			name: 'Iksan',
			email_address: 'iksansahib@gmail.com',
			phone: '0908908090'
		},
		{
			name: 'Diah',
			email_address: 'diah@gmail.com',
			phone: '0807968575'
		},
		{
			name: 'Akram',
			email_address: 'akram@gmail.com',
			phone: '07675654556'
		},
		{
			name: 'Syahnaz',
			email_address: 'syahnaz@gmail.com',
			phone: '0454535454'
		},
	]	
)