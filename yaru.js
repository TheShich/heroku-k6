import http from "k6/http";
import { check } from "k6";

export let options = {
	maxRedirects: 0,
	discardResponseBodies: true, 
	scenarios: {  
		yaru: { 
			executor: 'ramping-arrival-rate',  
			exec: 'get_yaru',
			startRate: 0,
			timeUnit: '1m', 
			preAllocatedVUs: 0,
			maxVUs: 5,  
		stages: [
			{target: 60, duration: '5m'},  //5 
			{target: 60, duration: '10m'}, //10	
			{target: 72, duration: '5m'},  //5	
			{target: 72, duration: '10m'}, //10	
		],
		},
		wwwru: { 
			executor: 'ramping-arrival-rate',  
			exec: 'get_wwwru',
			startRate: 0,
			timeUnit: '1m', 
			preAllocatedVUs: 0,
			maxVUs: 10,  
		stages: [
			{target: 120, duration: '5m'},	
			{target: 120, duration: '10m'},	
			{target: 144, duration: '5m'},	
			{target: 144, duration: '10m'},	
		],
		},
	},

	thresholds: {
		http_req_failed: ['rate<0.01'],
		http_req_duration: ['p(95)<500'],

	}
};


export default function(){
	group("get_yaru", function(){get_yaru()})
	group("get_wwwru", function(){get_wwwru()})

};

export function get_yaru(){
	let res = http.get("https://ya.ru");
	check(res, {
		"status code is 200": (res) => res.status == 200,
	});


};

export function get_wwwru(){
	let res = http.get("http://www.ru");
	check(res, {
		"status code is 200": (res) => res.status == 200,
	});

};
