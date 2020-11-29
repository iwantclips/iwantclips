function amount_filter(amount, email, member_id) {
	//Check if amount filter is already set
	if(store.get('a_filter')) {
		//Check Values of filter
		var a_filter = store.get('a_filter');
		//Check if the amount of time that has spanned
		var hours = (new Date().getTime() - a_filter.stime) / 1000 / 60 / 60;
		var minutes = (new Date().getTime() - a_filter.stime) / 1000 / 60 / 60 / 60;
		//If allowed time for amount has passed, remove the stored variables
		if(hours >= 1) {
			//Reset Filter
			store.set('a_filter', '');
		} else {
			//Check if user has gone over max attempts for the same amount
			$.each(a_filter.amount, function(key, value) {
				if(amount == key) {
					if(a_filter.amount[key] >= 5) {
						var msg = "Member has Added Funds of the same amout over 5 times.";
						$.ajax({
		                    url: base_url + '/home/ban_member/' + member_id + '/' + msg + '/3',
		                    type: 'post',
		                    data: '',
		                    dataType: 'json'
		                }).done(function (data) {
		                    if (data.redirect) {
		                    	//ban successful. Remove local data to prevent repeat banning.
		                    	store.set('a_filter', '');
		                    	window.location = data.redirect;
		                    } else {
		                    	//Unable to ban member. Show them a message
		                    	alert("Your account cannot process transactions at this time. Please contact a site administrator if you have questions.");
		                    }
						});
					} else {
						a_filter.amount[key] += 1;
					}
				}
				//Add key if it doesn't exist
				if(!(amount in a_filter.amount)) {
					a_filter.amount[amount] = 1;
				}		
			});
			
			store.set('a_filter', a_filter);			
		}
	} else {
		//Setup the filter
		var stime = new Date().getTime();
		var atime = new Date().getTime();
		var amountobj = {};
		amountobj[amount] = 1;
		store.set('a_filter', { stime: stime, amount: amountobj, email: email});
	}
}

function dc_filter(num, email, member_id) {
	//Check if amount filter is already set
	if(store.get('dc_filter')) {
		//Check Values of filter
		var dc_filter = store.get('dc_filter');
		//Check if the dc time that has spanned
		var hours = (new Date().getTime() - dc_filter.stime) / 1000 / 60 / 60;
		//If allowed time for amount has passed, remove the stored variables
		if(hours >= 24) {
			//Reset Filter
			store.set('dc_filter', '');
		} else {
			//Track DC
			if(!(num in dc_filter.dc)) {
				dc_filter.dc[num] = 1;
			}
			//Check the amount of total DCs
			if(Object.keys(dc_filter.dc).length >= 3) {
				if(Object.keys(dc_filter.dc).length == 3) {
					if(!dc_filter.alert_sent) {
						//Send alert only
						var title = "Fraud Alert";
						var msg = "Member has attempted to use 3 different cards in 24 hours. This is just a warning.";
						$.ajax({
		                    url: base_url + '/push_notification/ajax/',
		                    type: 'post',
		                    data: { title: title, message: msg, member_id: member_id, email: email, note: 2, filter_type: 'dc_filter' },
		                    dataType: 'json'
		                });
		                dc_filter['alert_sent'] = 1;
		            }
				} else {
					//Time to ban account
					var msg = "Member has used more than 3 different cards in 24 hours";
					$.ajax({
	                    url: base_url + '/home/ban_member/' + member_id + '/' + msg + '/2',
	                    type: 'post',
	                    data: '',
	                    dataType: 'json'
	                }).done(function (data) {
	                    if (data.redirect) {
	                    	//ban successful. Remove local data to prevent repeat banning.
	                    	store.set('dc_filter', '');
	                    	window.location = data.redirect;
	                    } else {
	                    	//Unable to ban member. Show them a message
	                    	alert("Your account cannot process transactions at this time. Please contact a site administrator if you have questions.");
	                    }
					});
				}
			}
			store.set('dc_filter', dc_filter);			
		}
	} else {
		//Setup the filter
		var stime = new Date().getTime();
		var dc = {};
		dc[num] = 1;
		store.set('dc_filter', { stime: stime, dc: dc, email: email});
	}
}


function lcp_filter(member_id, amount) {
	//let's check if member has been registered less than 24 hours since right now
	$.ajax({
		url: base_url + 'member/myaccount/is_less_than_24_hours_active/' + member_id,
		type: 'post',
        dataType: 'json',
        success: function(data) {
        	// if after a check result is TRUE and amount is greater than 251 - soft ban member and stop transaction
        	// handle_response is a function that defined in cart_checkout_member_modal
        	if (amount > 251.00 && data.result == 'TRUE') {
        		var title = "Fraud Alert";
				var msg = "Member has just attempted to checkout with a cart purchase of more than $251 and his account has only been active for less than 24 hours";
				$.ajax({
		            url: base_url + '/push_notification/ajax/',
		            type: 'post',
		            data: {
		            	title: title, 
		            	message: msg, 
		            	member_id: member_id,
		            	note: 5, 
		            	amount: amount, 
		            	filter_type: 'lcp_filter'
		            }
		        });
        	}
        }
	});
}

function lgt_filter(email, amount, country, store_name) {
	var total_amount = amount.replace('$','');
	if (total_amount > 250.00) { 
		$.ajax({
	        url: '//freegeoip.net/json/',
	        dataType: 'jsonp',
	        type: 'post',
	        success: function(result) {
	            var guest_country_name = result.country_name;
	            var title = "Fraud Alert";
				var msg = 'Guest has just tributed more than $250.';
				$.ajax({
	                url: base_url + '/push_notification/ajax/',
	                type: 'post',
	                data: {
	                	title: title, 
	                	message: msg, 
	                	email: email, 
	                	amount: total_amount, 
	                	card_country: country, 
	                	guest_country: guest_country_name, 
	                	store_name: store_name, 
	                	note: 6,
	                	filter_type: 'lgt_filter'
	                },
	                dataType: 'json'
	            });
	        }
		});
	}
}

function maf_filter(username, email, member_id, amount, cc_country_code) {
	var total_amount = amount.replace('$','');
	if (total_amount > 500.00) {
		var warning = (!cc_country_code) ? 'Member is using CC that is on the file' : '';
		var title = "Fraud Alert";
		var msg = "Member is trying to add more than $500";
		$.ajax({
		    url: base_url + '/push_notification/ajax/',
		    type: 'post',
		    data: {
		    	title: title, 
		    	message: msg, 
		    	email: email,
		    	note: 7, 
		    	amount: total_amount, 
		    	member_username: username,
		    	member_id: member_id,
		    	card_country: cc_country_code,
		    	warning: warning,
		    	transaction: 'Memer Add Funds',
		    	filter_type: 'maf_filter'
		    },
		    dataType: 'json'
		});
	}
}

function mia_filter(username, member_id, email, amount, country_code) {
	var total_amount = amount.replace('$','');
	// country is only available when a credit card info inserted,
	// the info that is on the file doesn't provide us country code on the front end
	if (country_code) {	
		$.ajax({
	        url: '//freegeoip.net/json/',
	        dataType: 'jsonp',
	        type: 'post',
	        success: function(result) {
	            var country_code_by_member_ip = result.country_code;

	            // send pushover notification if countries doesn't match
	            if (country_code_by_member_ip !== country_code) {
	            	var title = "Fraud Alert";
					var msg = "Memer's ip is different than ip addresses native to the country the Credit Card is from.";
					$.ajax({
	                    url: base_url + '/push_notification/ajax/',
	                    type: 'post',
	                    data: {
	                    	title: title, 
	                    	message: msg, 
	                    	email: email,
	                    	note: 8,
	                    	amount: total_amount, 
	                    	member_username: username,
	                    	member_id: member_id,
	                    	member_country: country_code_by_member_ip,
	                    	card_country: country_code, 
	                    	transaction: 'Memer Add Funds',
	                    	filter_type: 'mia_filter'
	                    },
	                    dataType: 'json'
	                });
	            }
	        }
		});
	}
}

function gip_filter(num, email, amount, country) {
	// test ip address :  95.108.142.13
	// getting guest's info
	$.ajax({
        url: '//freegeoip.net/json/',
        dataType: 'jsonp',
        type: 'post',
        success: function(result) {
            var country_where_guest_from = result.country_code;
            var guest_country_name = result.country_name;
            
            // send pushover notification if countries doesn't match
            if (country_where_guest_from !== country) {
            	var title = "Fraud Alert";
				var msg = "Guest's location is different than the location of credit card he is using.";
				$.ajax({
                    url: base_url + '/push_notification/ajax/',
                    type: 'post',
                    data: {
                    	title: title, 
                    	message: msg, 
                    	email: email,
                    	note: 9,
                    	amount: amount, 
                    	card_country: country, 
                    	guest_country: 
                    	guest_country_name, 
                    	transaction: 'Guest clip purchase',
                    	filter_type: 'gip_filter'
                    },
                    dataType: 'json'
                });
            }

        }
	});
}

function dcg_filter(num, email) {
	//Check if amount filter is already set
	if (store.get('dcg_filter')) {
		//Check Values of filter
		var dcg_filter = store.get('dcg_filter');
		//Check if the dc time that has spanned
		var hours = (new Date().getTime() - dcg_filter.stime) / 1000 / 60 / 60;
		//If allowed time for amount has passed, remove the stored variables
		if (hours >= 24) {
			//Reset Filter
			store.set('dcg_filter', '');
		} else {
			//Track DC
			if(!(num in dcg_filter.dc)) {
				dcg_filter.dc[num] = 1;
			}
			//Check the amount of total DCs
			if (Object.keys(dcg_filter.dc).length >= 3) {
				if (Object.keys(dcg_filter.dc).length == 3) {
					if (!dcg_filter.alert_sent) {
						//Send alert only
						var title = "Fraud Alert";
						var msg = 'Guest has attempted to use 3 different cards in 24 hours. This is just a warning.';
						$.ajax({
		                    url: base_url + '/push_notification/ajax/',
		                    type: 'post',
		                    data: {
		                    	title: title, 
		                    	message: msg, 
		                    	email: email, 
		                    	note: 2,
		                    	filter_type: 'dcg_filter' 
		                    },
		                    dataType: 'json'
		                });
		                dcg_filter['alert_sent'] = 1;
		            }
				} 
			}
			store.set('dcg_filter', dcg_filter);			
		}
	} else {
		//Setup the filter
		var stime = new Date().getTime();
		var dc = {};
		dc[num] = 1;
		store.set('dcg_filter', { stime: stime, dc: dc, email: email});
	}
}

function g_spending(amount, email, check) {
	//Check if spending filter is already set
	if(store.get('g_filter')) {
		//Check Values of filter
		var g_filter = store.get('g_filter');
		//Check if the dc time that has spanned
		var hours = (new Date().getTime() - g_filter.stime) / 1000 / 60 / 60;
		//If allowed time for amount has passed, remove the stored variables
		if(hours >= 24) {
			//Setup the filter
			var stime = new Date().getTime();
			store.set('g_filter', { stime: stime, total: amount, email: email});
			return true;
		} else {
			//Check daily total was reached
			var tmp_total = +amount + +g_filter.total;
			//Check if purchase would push over the limit
			if(check == 1) {
				if(tmp_total > 150) {
					return false;
				}
			} else {
				//Set new total
				g_filter.total = tmp_total;
			}
			store.set('g_filter', g_filter);
			return true;		
		}
	} else {
		//Setup the filter
		var stime = new Date().getTime();
		store.set('g_filter', { stime: stime, total: amount, email: email});
		return true;
	}
}

function fails(member_id, email) {
	//Check if spending filter is already set
	if(store.get('f_filter')) {
		//Check Values of filter
		var f_filter = store.get('f_filter');
		//Check the time that has spanned
		var mins = (new Date().getTime() - f_filter.stime) / 1000 / 60 / 60 / 60;
		//If allowed time for amount has passed, remove the stored variables
		if(mins >= 30) {
			//Setup the filter
			var stime = new Date().getTime();
			store.set('f_filter', { stime: stime, fails: 1, member_id: member_id, email: email});
			return true;
		} else {
			var tmp_fails = +f_filter.fails +1;
			f_filter.fails = tmp_fails;
			store.set('f_filter', f_filter);
			return true;	
		}
	} else {
		//Setup the filter
		var stime = new Date().getTime();
		store.set('f_filter', { stime: stime, fails: 1, member_id: member_id, email: email});
		return true;
	}
}

function send_fails(member_id, email) {
	if (store.get('f_filter')) {
		//Check Values of filter
		var f_filter = store.get('f_filter');
		var tmp_fails = f_filter.fails;

		if (tmp_fails >= 3) {
			//Send alert only
			var title = "Fraud Alert";
			var msg = "Member has had " + tmp_fails + " failed attempts in 30 min. This is just a warning.";
			$.ajax({
	            url: base_url + '/push_notification/ajax/',
	            type: 'post',
	            data: {
	            	title: title, 
	            	message: msg, 
	            	member_id: member_id, 
	            	email: email, 
	            	note: 4,
	            	filter_type: 'send_fails'
	            }
	        });
	        var stime = new Date().getTime();
			store.set('f_filter', { stime: stime, fails: 0, member_id: member_id, email: email});
		} else if (tmp_fails == 6) { // on 6th attempt ban member
			var mid = window.btoa(member_id);
			var title = "Fraud Alert";
			var msg = "Member has had " + tmp_fails + " failed attempts in 30 min. Member has been added to the Soft Ban List!";
			var stime = new Date().getTime();

			// ban member
			$.ajax({
	            url: base_url + '/home/pushover_ban_member/' + mid, 
	            type: 'post',
	            success: function(result) {
	            }
	        });

			// notify 
			$.ajax({
	            url: base_url + '/push_notification/ajax/',
	            type: 'post',
	            data: {
	            	title: title, 
	            	message: msg, 
	            	member_id: member_id, 
	            	email: email, 
	            	note: 10,
	            	filter_type: 'send_fails'
	            }
	        });
	        
			store.set('f_filter', { stime: stime, fails: 0, member_id: member_id, email: email});
		}

	}
}

function fails_g(email) {
	//Check if spending filter is already set
	if (store.get('fg_filter')) {
		//Check Values of filter
		var fg_filter = store.get('fg_filter');
		//Check the time that has spanned
		var mins = (new Date().getTime() - fg_filter.stime) / 1000 / 60 / 60 / 60;
		//If allowed time for amount has passed, remove the stored variables
		if (mins >= 30) {
			//Setup the filter
			var stime = new Date().getTime();
			store.set('fg_filter', { stime: stime, fails: 1, email: email});
			return true;
		} else {
			var tmp_fails = +fg_filter.fails +1;
			fg_filter.fails = tmp_fails;
			store.set('fg_filter', fg_filter);
			return true;
		}
	} else {
		//Setup the filter
		var stime = new Date().getTime();
		store.set('fg_filter', { stime: stime, fails: 1, email: email});
		return true;
	}
}

function send_fails_g(email) {
	if (store.get('fg_filter')) {
		var fg_filter = store.get('fg_filter');
		var tmp_fails = fg_filter.fails;
		if (tmp_fails >= 3) {
			var title = "Fraud Alert";
			var msg = "Guest Email: " + email + ". Guest has had " + tmp_fails + " failed attempts in 30 min. This is just a warning.";
			$.ajax({
	            url: base_url + 'push_notification/ajax/',
	            type: 'post',
	            data: {
	            	title: title, 
	            	message: msg, 
	            	email: email, 
	            	note: 4,
	            	filter_type: 'send_fails_g'
	            }
	        });
	        var stime = new Date().getTime();
			store.set('fg_filter', { stime: stime, fails: 0, email: email});
		}
	}
}