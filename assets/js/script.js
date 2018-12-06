var usdtbtc, usdcbtc, usdcusdt = [1, 2, 3];
var usd = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var pairs = ["BTC", "USDT", "USDC"];
var coins = ["DOGE", "LTC", "STR", "XMR", "XRP", "ETH", "ZEC"];
var usdcusdt = 226;
var usdtbtc = 121;
var usdcbtc = 224;
pairs["BTC"] = [27, 50, 89, 114, 117, 148, 178];
pairs["USDT"] = [216, 123, 125, 126, 127, 149, 180];
pairs["USDC"] = [243, 244, 242, 241, 240, 225, 245];
createTables(coins, pairs);
var connection = new WebSocket('wss://api2.poloniex.com');
connection.onopen = function () {
  connection.send(JSON.stringify({"command":"subscribe","channel":1002}));
};
connection.onerror = function (error) {
  console.log('WebSocket Error ' + JSON.stringify(error));
};
connection.onmessage = function (e) {
	if(e.length != 0) {
		var msg = JSON.parse(e.data);
		var channelId = msg[0];
		switch(channelId) {
			case 1010:
				connection.send(JSON.stringify({"command":"subscribe","channel":1002}));
				break;
			case 1002:
				var data = msg[2];
				if (data != undefined) {
				switch(data[0]) {
					case 121: // BTC-USDT
						usd[1] = data[1]; // Last Price
						usd[2] = data[2]; // Ask
						usd[3] = data[3]; // Buy
						break;
					case 226: // USDT-USDC
						usd[4] = data[1];
						usd[5] = data[2];
						usd[6] = data[3];
						break;
					case 224: // USDC-BTC
						usd[7] = data[1];
						usd[8] = data[2];
						usd[9] = data[3];
						break;
				}
				$('table').each(function(i, obj) {					
					if (data[0] == $(this).attr('data-btc')) {
						$(this).find('.first').html("<p class=\"sell mb-0\">" + (data[3] - 0.00000001) * usd[3] + "</p><p class=\"buy mb-0\">" + (parseFloat(data[2]) + 0.00000001) * usd[2] + "</p>");
					} else if (data[0] == $(this).attr('data-usdt')) {
						$(this).find('.second').html("<p class=\"sell mb-0\">" + (data[3] - 0.00000001) + "</p><p class=\"buy mb-0\">" + (parseFloat(data[2]) + 0.00000001) + "</p>");
					} else if (data[0] == $(this).attr('data-usdc')) {
						$(this).find('.third').html("<p class=\"sell mb-0\">" + (data[3] - 0.00000001) / usd[6] + "</p><p class=\"buy mb-0\">" + (parseFloat(data[2]) + 0.00000001) / usd[5] + "</p>");	
					}					
					if ($(this).find("p").length == 6) {
						var buy = [];
						var sell = [];
						for (var j = 0; j < 6; j++){
							if (j % 2 == 0)
								sell[j] = $(this).find("p:eq("+j+")").html();
							else
								buy[j] = $(this).find("p:eq("+j+")").html();
						}
						var la = sell.indexOf(findmax(sell));
						var hb = buy.indexOf(findmin(buy));
						for (var k = 0; k < 6; k++){
							if (k % 2 == 0) {
								if (k == la) {
									$(this).find("p:eq("+k+")").addClass("better");
								} else {
									$(this).find("p:eq("+k+")").removeClass("better");
								}
							} else {
								if (k == hb) {
									$(this).find("p:eq("+k+")").addClass("better");
								} else {
									$(this).find("p:eq("+k+")").removeClass("better");
								}
							}							
						}
						$(this).find('.fourth').html($(this).find(".sell.better").html() / $(this).find(".buy.better").html());
						if ($(this).find(".buy.better").html() < $(this).find(".sell.better").html())
							$(this).find("tr").addClass("deal");
						else
							$(this).find("tr").removeClass("deal");
					}
				});
				}
				break;
		}
	}
};
function createTables(coins, pairs) {
	var place = $("#fiat");
	for (var i = 0; i < coins.length; i++){
		var col = $('<div class=\"col-12 col-lg-6 p-3\"><h5 class=\"text-center\">'+ coins[i] +'</h5></div>');
		var table = $('<table data-name="'+coins[i]+'" data-btc="'+pairs["BTC"][i]+'" data-usdt="'+pairs["USDT"][i]+'" data-usdc="'+pairs["USDC"][i]+'" class=\"table table-striped text-center\"></table>');
		var table_head = $('<thead><tr><th scope="col">BTC->USDT</th><th scope="col">USDT</th><th scope="col">USDC->USDT</th><th scope="col">%</th></tr></thead>');
		var table_content = $('<tbody><tr><td class=\"first\" scope=\"row\"></td><td class=\"second\"></td><td class=\"third\"></td><td class=\"fourth\"></td></tr></tbody>');
		table.append(table_head);
		table.append(table_content);
		col.append(table);
		place.append(col);
	}
}
function findmax(array)
{
    var max = 0;
    var a = array.length;
    for (counter=0;counter<a;counter++)
    {
        if (array[counter] > max)
        {
            max = array[counter];
        }
    }
    return max;
}

function findmin(array)
{
    var min = array[1];
    var a = array.length;
    for (counter=0;counter<a;counter++)
    {
        if (array[counter] < min)
        {
            min = array[counter];
        }
    }
    return min;
}