export const FEED_DATA = [
	{
		id: "1",
		type: "post",
		user: "Mark Albert",
		title: "A Galaxy",
		descirption:
			"Actual proof of the Milky Way consisting of many stars came in 1610 when the Italian astronomer Galileo Galilei used a telescope to study it and discovered it was composed of a huge number of faint stars.[30][31] In 1750, English astronomer Thomas Wright, in his An Original Theory or New Hypothesis of the Universe, correctly speculated that it might be a rotating body of a huge number of stars held together by gravitational forces, akin to the Solar System but on a much larger scale, and that the resulting disk of stars could be seen as a band on the sky from a perspective inside it.[b][33][34] In his 1755 treatise, Immanuel Kant elaborated on Wright's idea about the Milky Way's structure.[35]",
		imgs: [
			{
				id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
				url: "https://images.unsplash.com/photo-1525431836161-e40d6846e656?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			},
			{
				id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28458",
				url: "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			}
		],
	},
	{
		id: "2",
		type: "post",
		user: "Otto Anderson",
		title: "Dimensions",
		descirption: "Although dimensions are available immediately, they may change (e.g due to device rotation, foldable devices etc)",
		imgs: [
			{
				id: "full-moon-9dTg44Qhx1Q",
				url: "https://images.unsplash.com/photo-1481819613568-3701cbc70156?q=80&w=2016&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			},
			{
				id: "nebula-rTZW4f02zY8",
				url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1822&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			},
			{
				id: "a-view-of-the-earth-from-space-Jn2EaLLYZfY",
				url: "https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			}
		]
	},
	{
		id: "3",
		type: "post",
		user: "Linus Walker",
		title: "The Sun",
		descirption: "The Sun's gravity holds the solar system together, keeping everything – from the biggest planets to the smallest particles of debris – in its orbit. The connection and interactions between the Sun and Earth drive the seasons, ocean currents, weather, climate, radiation belts and auroras. Though it is special to us, there are billions of stars like our Sun scattered across the Milky Way galaxy.The Sun has many names in many cultures. The Latin word for Sun is “sol,” which is the main adjective for all things Sun-related: solar.",
		imgs: [
			{
				id: "the-sun-9dTg44Qhx1Q",
				url: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			}
		]
	},
	{
		id: "4",
		type: "drivers",
		users: [
			{
				id: "driver-01",
				user: "William",
				img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
			},
			{
				id: "driver-02",
				user: "Michael",
				img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxLDEajEW8QIw_X_Zt5S-1rxj0-lhuljenolf6zjfThRco-WTZIlp_QU-BIFFBhjhp9uM&usqp=CAU"
			}
		]
	}
];

export const NOTI_DATA = [
	{
		id: "1",
		created_date: "4h ago",
		message: "commented on the status you shared.",
		user: {
			id: 2,
			name: "Otto Anderson",
			img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		}
	},
	{
		id: "",
		created_date: "2d ago",
		message: "voted on the status you shared",
		user: {
			id: 2,
			name: "Otto Anderson",
			img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		}
	}
];

export const STATUS_DATA = [
	{
		id: "1",
		category: "Package",
		title: "Yangon to Mandalay",
		items: ["One tea, Tier", "Premier Expresso"],
		date: "2 days ago",
		variant: "history",
		driver: {
			name: "U Wai Linn",
			age: 69,
			license: "112233445",
		},
		car: {
			brand: "Fuso FJ 2528R Cargo",
		},
		destination: {
			from: "Yangon",
			to: "Mandalay",
		},
		period: "2 days",
	},
	{
		id: "2",
		category: "Package",
		title: "Mandalay to Yangon",
		items: ["One tea, Tier", "Premier Expresso"],
		variant: "current",
		driver: {
			name: "U Wai Linn",
			age: 69,
			license: "112233445",
		},
		car: {
			brand: "Fuso FJ 2528R Cargo",
		},
		destination: {
			from: "Mandalay",
			to: "Yangon",
		},
	},
	{
		id: "3",
		category: "Driver",
		title: "U Wai Linn",
		username: "U Wai Linn",
		desc: "I have over 3 years experience in driving",
		variant: "history",
	},
	{
		id: "4",
		category: "Car",
		model: "Fuso FJ 2538R Cargo",
		title: "Fuso FJ 2528R Cargo",
		desc: "yangon to mandaly",
		variant: "history",
	},
];

export const CONNECTION_DATA = [
	{
		id: 1,
		username: "Linus Walker"
	},
	{
		id: 2,
		username: "William"
	},
	{
		id: 3,
		username: "nebula-rTZW4f02zY8"
	},
	{
		id: 4,
		username: "User124045"
	}
]

export const PACKAGE_DATA = [
	{
		type: "Owner",
		coordinate: {
			latitude: 16.826111566733648,
			longitude: 96.13035812250988,
		},
		title: "Origin",
		description: "Start Point",
	},
	{
		type: "Owner",
		coordinate: {
			latitude: 21.94893745302357,
			longitude: 96.08852235463286,
		},
		title: "Destination",
		description: "End Point",
	},
	{
		type: "User1",
		coordinate: {
			latitude: 17.042428710919555,
			longitude: 96.12878120397383,
		},
		title: "User1Origin",
		description: "Start Point",
	},
	{
		type: "User1",
		coordinate: {
			latitude: 20.881312699222843,
			longitude: 95.86086683066863,
		},
		title: "User1Destination",
		description: "End Point",
	},
	{
		type: "User2",
		coordinate: {
			latitude: 21.433729341389252,
			longitude: 96.10751692235945,
		},
		title: "User2Origin",
		description: "Start Point",
	},
	{
		type: "User2",
		coordinate: {
			latitude: 21.7359429298148,
			longitude: 96.10394794148395,
		},
		title: "User2Destination",
		description: "End Point",
	},
]
