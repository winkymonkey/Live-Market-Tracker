$(document).ready(function() {    
    let mapping = {
        "DEBT_SBI": "https://api.mfapi.in/mf/119824",       //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF200K01VB0&dur=ALL&ind_id=82&classic=true&type=benchmark&investmentType=Debt
        "SMALL_NIPPON": "https://api.mfapi.in/mf/118778",   //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF204K01K15&dur=ALL&ind_id=9&classic=true&type=benchmark&investmentType=Equity
        "SMALL_SBI": "https://api.mfapi.in/mf/125497",      //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF200K01T51&dur=ALL&ind_id=26&classic=true&type=benchmark&investmentType=Equity
        "SMALL_HDFC": "https://api.mfapi.in/mf/130503",     //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF179KA1RW5&dur=ALL&ind_id=53&classic=true&type=benchmark&investmentType=Equity
        "FLEXI_KOTAK": "https://api.mfapi.in/mf/120166",    //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF174K01LS2&dur=ALL&ind_id=9&classic=true&type=benchmark&investmentType=Equity
        "FLEXI_PARAG": "https://api.mfapi.in/mf/122639",    //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF879O01027&dur=ALL&ind_id=7&classic=true&type=benchmark&investmentType=Equity
        "FLEXI_MOTILAL": "https://api.mfapi.in/mf/129046",  //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF247L01502&dur=ALL&ind_id=7&classic=true&type=benchmark&investmentType=Equity
        "ELSS_NIPPON": "https://api.mfapi.in/mf/103196",    //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF204K01GK4&dur=ALL&ind_id=1&classic=true&type=benchmark&investmentType=Equity
        "ELSS_MIRAE": "https://api.mfapi.in/mf/135781",     //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF769K01DM9&dur=ALL&ind_id=9&classic=true&type=benchmark&investmentType=Equity
        "ELSS_MOTILAL": "https://api.mfapi.in/mf/133386",   //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF247L01569&dur=ALL&ind_id=7&classic=true&type=benchmark&investmentType=Equity
        "LARGE_SBI": "https://api.mfapi.in/mf/103504",      //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF200K01180&dur=ALL&ind_id=1&classic=true&type=benchmark&investmentType=Equity
        "BALANCED_ICICI": "https://api.mfapi.in/mf/120251"  //https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=INF109K01Y07&dur=ALL&ind_id=9&classic=true&type=benchmark&investmentType=Hybrid
    };
    
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        "dateFormat": "dd-mm-yy",
        "minDate": new Date("January 29, 2013"),
        "beforeShowDay": $.datepicker.noWeekends
    });
    
    
	$(document).ajaxSend(function() {
		addOverlay();
	});
    
    $("#how_many_days").on("focusout", function() {
        clipInput($(this));
    });
    
    $("#trackerSubmit").click(function() {
        //generateDailyTracker();
    	generateMultiDayTracker();
    });
    
    $("#dateSubmit").click(function() {
        //generateOneDayTracker();
    	generateOneDayTrackerNew();
    });
    
    
    
    
    // BUSINESS FUNCTIONS
    function generateMultiDayTracker() {
    	$('#records_table').empty();
    	$("#datepicker").val('');
    	let dayCount = $("#how_many_days").val();
    	
    	let promises = [];
    	let responseArr = [];
    	
    	for (key in mapping) {
    		let fundName = key;
    		let endpoint = mapping[key];
    		var settings = {
                "url": endpoint,
                "method": "GET",
                "timeout": 0,
            };
    		var request = $.ajax(settings).done(function (response) {
    			let obj = {
    				'fundName':fundName, 
    				'data':response.data
    			};
    			responseArr.push(obj);
    		});
    		promises.push(request);
    	}
    	
    	$.when.apply(null, promises).done(function() {
    		responseArr.sort(compare);
        	console.log(responseArr);
        	proessResponse(responseArr, dayCount);
        	removeOverlay();
        });
    }
    
    
    function generateOneDayTrackerNew() {
    	$('#records_table').empty();
        $("#how_many_days").val('');
        let mydate = $("#datepicker").val();
        
        let promises = [];
    	let responseArr = [];
    	
    	for (key in mapping) {
    		let fundName = key;
    		let endpoint = mapping[key];
    		var settings = {
                "url": endpoint,
                "method": "GET",
                "timeout": 0,
            };
    		var request = $.ajax(settings).done(function (response) {
    			let result = response.data.filter(item => item.date==mydate);
                response.data = result;
                
    			let obj = {
    				'fundName':fundName, 
    				'data':response.data
    			};
    			responseArr.push(obj);
    		});
    		promises.push(request);
    	}
    	
    	$.when.apply(null, promises).done(function() {
    		responseArr.sort(compare);
        	console.log(responseArr);
        	proessResponse(responseArr, 1);
        	removeOverlay();
        });
    }
    
    
    
    
    // Helper function
    function compare(a, b) {
    	if (a.fundName < b.fundName) {
    		return -1;
    	}
    	if (a.fundName > b.fundName) {
    		return 1;
    	}
    	return 0;
    }
    
    function proessResponse(responseArr, dayCount) {
    	try {
	    	let _rowHead = $('<thead>').append($('<th>').text("Fund Name"));
	    	for (i=0; i<dayCount; i++) {
	    		if (responseArr[0].data.length > 0) {
	    			_rowHead.append($('<th>').text(responseArr[0].data[i].date));
	    		}
	    		else {
	    			manageWarningMsg();		//invalid date is chosen
	    			return;
	    		}
	    	}
	    	$('#records_table').append(_rowHead);
	    	
	    	let _rowBody = $('<tbody>');
	    	for (j=0; j<responseArr.length; j++) {
	    		let _eachRow = $('<tr>').append($('<td>').text(responseArr[j].fundName));
	    		for (k=0; k<dayCount; k++) {
	    			_eachRow.append($('<td>').text(responseArr[j].data[k].nav));
	        	}
	    		_rowBody.append(_eachRow);
	    	}
	    	$('#records_table').append(_rowBody);
    	}
    	catch (err) {
    		flashErrorMsg();
    	}
    }
    
    
    
    
    // UTILITY FUNCTIONS
    function addOverlay() {
        $("#overlay").fadeIn(300);
    }
    
    function removeOverlay() {
        setTimeout(function(){
            $("#overlay").fadeOut(300);
        },500);
    }
    
    function flashErrorMsg() {
        $("#5xxError").fadeIn(500);
        setTimeout(function(){
            $("#5xxError").fadeOut(500);
        },1500);
    }
    
    function manageWarningMsg() {
        if ($('#records_table tbody tr td:nth-child(2)').length == 0) {
            $('#records_table').empty();
            $("#DateWarning").fadeIn(500);
            setTimeout(function(){
                $("#DateWarning").fadeOut(500);
            },1500);
        }
    }
    
    function clipInput(elem) {
        if (elem.val() > 30)
            elem.val(30);
        if (elem.val() < 0)
            elem.val(0);
    }
    
});
