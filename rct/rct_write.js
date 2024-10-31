//var net = require('net');

//var rct_host = "111.111.111.111"; //IP Adresse eintragen
//var rct_port = 8899;

createState('RCT-schreiben.min_SOC', async () => {
});
createState('RCT-schreiben.max_SOC', async () => {
});
createState('RCT-schreiben.battery_power_extern', async () => {
});
createState('RCT-schreiben.target_SOC', JSON.parse('{"type":"number", "unit": "%"}'), async () => {
});
createState('RCT-schreiben.load_set', JSON.parse('{"type":"number", "unit": "W"}'), async () => {
});
createState('RCT-schreiben.battery_to_grid', JSON.parse('{"type":"number", "unit": "W"}'), async () => {
});


//Prüfen auf änderung von minSOC, dann senden von min SOC
on({ id: 'javascript.0.RCT-schreiben.min_SOC' /* PV-Anlage.RCT-WR.min_SOC */, change: 'ne' }, async (obj) => {
	const value = obj.state.val;
	const oldValue = obj.oldState.val;
	let tmp_var, tmp_var_msg;
	tmp_var = getState('javascript.0.RCT-schreiben.min_SOC').val;
	if(tmp_var >0 && tmp_var <=100){
		tmp_var = Math.round((tmp_var/100) * 100) / 100;
		tmp_var_msg = floatToHex(tmp_var);
		console.log(tmp_var_msg);
		rct_Write('power_mng_soc_min', tmp_var_msg);
		console.log('Min SOC wird gesendet');
	}
});

//Prüfen auf änderung von maxSOC, dann senden
on({ id: 'javascript.0.RCT-schreiben.max_SOC' , change: 'ne' }, async (obj) => {
	const value = obj.state.val;
	const oldValue = obj.oldState.val;
	let tmp_var, tmp_var_msg;
	tmp_var = getState('javascript.0.RCT-schreiben.max_SOC').val;
	if(tmp_var >0 && tmp_var <=100){
		tmp_var = Math.round((tmp_var/100) * 100) / 100;
		tmp_var_msg = floatToHex(tmp_var);
		console.log(tmp_var_msg);
		rct_Write('power_mng_soc_max', tmp_var_msg);
		console.log('Max SOC wird gesendet');
	}

});

//Prüfen auf änderung von targetSOC, dann senden
on({ id: 'javascript.0.RCT-schreiben.target_SOC' , change: 'ne' }, async (obj) => {
	const value = obj.state.val;
	const oldValue = obj.oldState.val;
	let tmp_var, tmp_var_msg;
	tmp_var = getState('javascript.0.RCT-schreiben.target_SOC').val;
	if(tmp_var >0 && tmp_var <=100){
		tmp_var = Math.round((tmp_var/100) * 100) / 100;
		tmp_var_msg = floatToHex(tmp_var);
		console.log(tmp_var_msg);
		rct_Write('power_mng_target_soc', tmp_var_msg);
		console.log('Target SOC wird gesendet');
	}

});

//Prüfen auf änderung von battery power extern, dann send
on({ id: 'javascript.0.RCT-schreiben.battery_power_extern' , change: 'ne' }, async (obj) => {
	const value = obj.state.val;
	const oldValue = obj.oldState.val;
	let bat_ext_power, bat_ext_power_message;
	bat_ext_power = getState('javascript.0.RCT-schreiben.battery_power_extern').val;
	console.log(bat_ext_power);
	//bat_ext_power = Math.round((min_SOC/100) * 100) / 100;
	bat_ext_power_message = floatToHex(bat_ext_power);
	console.log(bat_ext_power_message);

	rct_Write('power_mng_battery_power_extern', bat_ext_power_message);
	console.log('Extern Power');

});

//Prüfen auf änderung von battery load set
on({ id: 'javascript.0.RCT-schreiben.load_set', change: 'ne' }, async (obj) => {
	const value = obj.state.val;
	const oldValue = obj.oldState.val;
	let load_set, load_set_message;
	load_set = getState('javascript.0.RCT-schreiben.load_set').val;
	console.log(load_set);
	//bat_ext_power = Math.round((min_SOC/100) * 100) / 100;
	load_set_message = floatToHex(load_set);
	console.log(load_set_message);

	rct_Write('io_board_load_set', load_set_message);
	console.log('Load Set');

});

//Prüfen auf änderung von battery to grid
on({ id: 'javascript.0.RCT-schreiben.battery_to_grid', change: 'ne' }, async (obj) => {
	const value = obj.state.val;
	const oldValue = obj.oldState.val;
	let bat_grid_set, bat_grid_message;
	bat_grid_set = getState('javascript.0.RCT-schreiben.battery_to_grid').val;
	console.log(bat_grid_set);
	//bat_ext_power = Math.round((min_SOC/100) * 100) / 100;
	bat_grid_message = floatToHex(bat_grid_set);
	console.log(bat_grid_message);

	rct_Write('bat_grid_set', bat_grid_message);
	console.log('Bat to grid: ' +bat_grid_set);

});




function rct_Write (command, message) {

	let cmd_send;
	switch(command){
		case 'power_mng_soc_min':
			cmd_send = rct_cmd.power_mng_soc_min;
			break;
		case 'power_mng_battery_power_extern':
			cmd_send = rct_cmd.power_mng_battery_power_extern;
			break;
		case 'power_mng_soc_max':
			cmd_send = rct_cmd.power_mng_soc_max;
			break;
		case 'power_mng_calib_charge_power':
			cmd_send = rct_cmd.power_mng_calib_charge_power;
			break;
		case 'power_mng_target_soc':
			cmd_send = rct_cmd.power_mng_soc_target_set;
			break;
		case 'io_board_load_set':
			cmd_send = rct_cmd.io_board_load_set;
			break;
		case 'bat_grid_set':
			cmd_send = rct_cmd.p_rec_lim;

	}

	console.log(cmd_send);
	const write_Message = getFrame(rct_const.command_byte_write, cmd_send, message);
	const read_Message = getFrame(rct_const.command_byte_read, cmd_send, '');

	var client = net.connect({ host:rct_host , port:rct_port}, function () {
		// 'connect' listener
		console.log('connected to server!');
		//Zwei mal schreiben funktioniert zuverlässiger, der Trick ist, den selben Datenpunkt auch zu lesen, nachdem er geschrieben wurde
		client.write(write_Message);
		client.write(write_Message);
	});

	client.on('data', function (data) {
		console.log(data);
		//Ändeurngen werden scheinbar nur übernommen, wenn man nach dem schrieben, die Variable gleich wieder aus liest
		client.write(read_Message);
		client.end();
	});

	client.on('end', function () {
		console.log('disconnected from server');
	});

	client.on('error', function (error) {
		console.error('error: ' + error);
		client.end();
	});

}

// berechnung der Checksum
function rct_crc (byteArray, previous) {

	// console.log('DEBUG CRC:',byteArray);

	let bit, c15;

	let crc = typeof previous !== 'undefined' ? ~~previous : 0xffff;

	if (byteArray.length % 2) {
		//console.log('DEBUG: rct.crc() adjust byteArray', byteArray);
		if (byteArray.push) byteArray.push(0);
		else byteArray = Buffer.concat([byteArray, Buffer.from([0])]);
	}

	for (let index = 0; index < byteArray.length; index++) {
		const byte = byteArray[index];
		for (let i = 0; i < 8; i++) {
			bit = ((byte >> (7 - i) & 1) == 1);
			c15 = (((crc >> 15) & 1) == 1);
			crc <<= 1;
			// @ts-ignore
			if (c15 ^ bit) crc ^= 0x1021;
		}
		crc &= 0xffff;
	}
	return crc;
}

function floatToHex(float){
	let expo = 20, basis, mant, sign;
	let test_expo = 0, test_binExpo;
	let ergebnis_hex, ergebnis_bin, bin_expo = 7;
	let rest, result;
	let bin_basis, bin_bit, bin_mant;

	//Bestimmung des Vorzeichens
	if(float >0){
		sign = '0';
	}else if (float <0){
		sign = '1';
		float *= -1;
	}else if(float ==0){
		ergebnis_hex = '00000000';
		return ergebnis_hex;
	}

	//Bestimmung des Exponeneten
	while(test_expo<=0){
		expo --;
		test_expo = float-Math.pow(2,expo);
	}//expo ist jetzt der richtige Exponent

	//Exponent in Binär
	basis = expo +127;
	bin_basis = decToBin (basis, 7);

	//normalisieren der Mantisse
	mant = float/Math.pow(2,expo);
	mant = mant-1;
	//nachkommateil mit 2^23 multiplizieren
	mant = Math.floor(mant * Math.pow(2,23));

	//Mantisse in binär
	bin_mant = decToBin(mant, 22);

	//kombination aller ergebnisse in einen binär String
	ergebnis_bin= [sign,bin_basis, bin_mant].join('');

	//console.log(ergebnis_bin);

	//konverteiren von Ergebnis_bin in Hex
	ergebnis_hex = binToHex(ergebnis_bin);
	//console.log(ergebnis_hex);

	return ergebnis_hex;
}


function decToBin (dec, expo){
	let bin_bit, bin;
	bin = '';
	for(let i = expo; i>=0; i--){
		if((dec-Math.pow(2,i))<0){
			bin_bit = '0';
		}else{
			bin_bit = '1';
			dec = dec-Math.pow(2,i);
		}
		bin = [bin, bin_bit].join('');
	}
	return bin;
}

function binToHex (bin){
	let sum=0;
	let digitNumber = 1;
	let ergebnis_hex = '', hex_bit;
	if(bin.lenght%4 > 0){
		console.warn('Fehler bei der Umwandlung');
		//return ;
	}

	for(let i = 0; i < bin.length; i++){
		hex_bit='';
		if(digitNumber == 1){
			sum+=bin.charAt(i)*8;
		}else if(digitNumber == 2){
			sum+=bin.charAt(i)*4;
		}else if(digitNumber == 3){
			sum+=bin.charAt(i)*2;
		}else if(digitNumber == 4){
			sum+=bin.charAt(i)*1;
			digitNumber = 0;
			if(sum < 10){
				hex_bit = sum;
			}else if(sum == 10){
				hex_bit='A';
			}else if(sum == 11){
				hex_bit='B';
			}else if(sum == 12){
				hex_bit='C';
			}else if(sum == 13){
				hex_bit='D';
			}else if(sum == 14){
				hex_bit='E';
			}else if(sum == 15){
				hex_bit='F';
			}
			sum=0;
		}
		digitNumber++;
		ergebnis_hex = [ergebnis_hex,hex_bit].join('');
	}
	return ergebnis_hex;
}
