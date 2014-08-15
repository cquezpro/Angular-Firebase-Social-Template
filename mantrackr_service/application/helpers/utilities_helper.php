<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('get_decimal_from_string'))
{
	function get_decimal_from_string($str){
		if ($str == null || $str == '') return 0;
		
		return $str + 0;
	}
	
}
	

if (! function_exists('assets_url')){
	
	function assets_url($path = ''){
		
		$url = base_url('application/assets') . $path;
		
		return $url;
		
	}
	
}

if ( ! function_exists('getDayTimeRange')){
	
	function getDayTimeRange($date){
		return array('min' => $date . " 00:00:00", 'max' => $date . " 23:59:59");
	}
}

if (! function_exists('getTodayTimeRange')){
	
	function getTodayTimeRange(){
		
		return getDayTimeRange(date("Y-m-d"));
		
	}
	
}

if ( ! function_exists('getYearTimeRange')){

	function getYearTimeRange($date){
		
		$res = rangeYear($date);
		
		return array('min' => $res['start'] . " 00:00:00", 'max' => $res['end'] . " 23:59:59");
		
	}
}


if (! function_exists('getThisYearTimeRange')){

	function getThisYearTimeRange(){

		return getYearTimeRange(date("Y-m-d"));
	}

}

if ( ! function_exists('getWeekTimeRange')){

	function getWeekTimeRange($date){

		$res = rangeWeek($date);
		
		return array('min' => $res['start'] . " 00:00:00", 'max' => $res['end'] . " 23:59:59");

	}
}


if (! function_exists('getFirstDayOfWeek')){
	
	function getFirstDayOfWeek($date){
		
		$dt = strtotime($date);
		return date('N', $dt)==1 ? date('Y-m-d', $dt) : date('Y-m-d', strtotime('last monday', $dt));
		
	}
}

if (! function_exists('getThisWeekTimeRange')){

	function getThisWeekTimeRange(){

		return getWeekTimeRange(date("Y-m-d"));

	}

}

if ( ! function_exists('getMonthTimeRange')){

	function getMonthTimeRange($date){

		$res = rangeMonth($date);

		return array('min' => $res['start'] . " 00:00:00", 'max' => $res['end'] . " 23:59:59");

	}
}


if (! function_exists('getThisMonthTimeRange')){

	function getThisMonthTimeRange(){

		return getMonthTimeRange(date("Y-m-d"));

	}

}


if (! function_exists('rangeMonth')){
	
	function rangeMonth($datestr) {
		
		$dt = strtotime($datestr);
		$res['start'] = date('Y-m-d', strtotime('first day of this month', $dt));
		$res['end'] = date('Y-m-d', strtotime('last day of this month', $dt));
		
		return $res;
	}
}

if (! function_exists('rangeWeek')){

	function rangeWeek($datestr) {
		
		$dt = strtotime($datestr);
		$res['start'] = date('N', $dt)==1 ? date('Y-m-d', $dt) : date('Y-m-d', strtotime('last monday', $dt));
		$res['end'] = date('N', $dt)==7 ? date('Y-m-d', $dt) : date('Y-m-d', strtotime('next sunday', $dt));
		return $res;
	}

}

if (! function_exists('rangeYear')){
	
	function rangeYear($datestr){
		
		$dt = strtotime($datestr);
		$res['start'] = date('Y', $dt) . "-01-01";
		$res['end'] = date('Y', $dt) . "-12-31";
		return $res;
	}
}



if (! function_exists("get_user_name")){
	
	function get_user_name($username, $email){
		if ($username != '') return $username;
		return $email;
	}
}

if (! function_exists("time_elapsed_string")){

	function time_elapsed_string($datetime, $full = false) {
		
		$now = new DateTime;
		$ago = new DateTime($datetime);
		$diff = $now->diff($ago);
	
		$diff->w = floor($diff->d / 7);
		$diff->d -= $diff->w * 7;
	
		$string = array(
				'y' => 'year',
				'm' => 'month',
				'w' => 'week',
				'd' => 'day',
				'h' => 'hour',
				'i' => 'minute',
				's' => 'second',
		);
		
		foreach ($string as $k => &$v) {
			if ($diff->$k) {
				$v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
			} else {
				unset($string[$k]);
			}
		}
	
		if (!$full) $string = array_slice($string, 0, 1);
		return $string ? implode(', ', $string) . ' ago' : 'just now';
	}
}
