<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class ServiceErrorCodes{

	public static $error_codes = array(
	
			//Global Errors
			'SUCCESS' => array('code' => 0, 'msg' => 'Success'),
			'UNKNOWN_ERROR' => array('code' => 505, 'msg' => 'Unknown error.'),
			
			//User Registration
			'EMAIL_REQUIRED' => array('code' => 10, 'msg' => 'Email address required.'),
			'INVALID_EMAIL' => array('code' => 11, 'msg' => 'Invalid email address.'),
			'PASSWORD_REQUIRED' => array('code' => 12, 'msg' => 'Password required.'),
			'PASSWORD_MISMATCH' => array('code' => 13, 'msg' => 'Password mismatch.'),
			'EMAIL_ALREADY_REGISTERED' => array('code' => 14, 'msg' => 'This email has already been registered.'),
			'REG_DB_FAILURE' => array('code' => 15, 'msg' => 'Unable to insert information to db'),
			'EMAIL_NOT_REGISTERED' => array('code' => 16, 'msg' => 'Such email has not been registered.'),
			'PASSWORD_RESET_ERROR' => array('code' => 17, 'msg' => 'Password could not be reset.'),
			
			//User Login
			'INCORRECT_EMAIL_OR_PASSWORD' => array('code' => 20, 'msg' => 'Incorrect email or password'),
			'TOKEN_GENERATION_ERROR' => array('code' => 21, 'msg' => 'Unable to generate new token'),
			'ACCOUNT_BANNED' => array('code' => 22, 'msg' => 'Your account has been deleted by Administrator.'),
			'ACCOUNT_DEACTIVATED' => array('code' => 23, 'msg' => 'Your account has been de-activated.'),
			
			//User Logout & Update profile
			'TOKEN_REQUIRED' => array('code' => 30, 'msg' => 'Token required.'),
			'TOKEN_INVALID' => array('code' => 31, 'msg' => 'Token is invalid'),
			'UPDATE_FAILED' => array('code' => 32, 'msg' => 'Unable to update profile information on db.'),
			'SETTINGS_NOT_FOUND' => array('code' => 33, 'msg' => 'Unable to retrieve settings from db.'),
			'CURRENT_PASSWORD_REQUIRED' => array('code' => 34, 'msg' => 'Current password required.'),
			'NEW_PASSWORD_REQUIRED' => array('code' => 35, 'msg' => 'New password required.'),
			'PASSWORD_CHANGE_ERROR' => array('code' => 36, 'msg' => 'Pasword could not be changed.'),
			'CURRENT_PASSWORD_INCORRECT' => array('code' => 37, 'msg' => 'Current password is incorrect.'),
			'NEW_EMAIL_REQUIRED' => array('code' => 38, 'msg' => 'New email required.'),
			'EMAIL_CHANGE_ERROR' => array('code' => 39, 'msg' => 'Unable to change email due to DB error.'),
			
			//Photo Upload
			'UPLOAD_FAILED' => array('code' => 40, 'msg' => 'Upload Failed'),
			'THUMBNAIL_CREATION_FAILED' => array('code' => 41, 'msg' => 'Thumbnail creation failed.'),
			'PHOTO_SAVE_FAILED' => array('code' => 42, 'msg' => 'Unable to save new photo information.'),
			'PHOTO_ID_REQUIRED' => array('code' => 43, 'msg' => 'Photo ID not specified.'),
			'PHOTO_NOT_FOUND' => array('code' => 44, 'msg' => 'User photo could not be found.'),
			'PHOTO_REMOVE_FAILED' => array('code' => 45, 'msg' => 'Unable to remove photo.'),
			'PHOTO_PRIVACY_REQUIRED' => array('code' => 46, 'msg' => 'Photo privacy not specified.'),
			'PHOTO_SET_PRIVACY_FAILED' => array('code' => 47, 'msg' => 'Photo privacy set failed.'),
			
			//Member Search
			'MEMBER_SEARCH_FAILED' => array('code' => 50, 'msg' => 'Unable to search members.'),
			'SEARCH_QUERY_NOT_FOUND' => array('code' => 51, 'msg' => 'Search query not specified.'),
			
			//Membership
			'STANDOUT_TYPE_REQUIRED' => array('code' => 60, 'msg' => 'Standout type ID not specified.'),
			'STANDOUT_TYPE_NOTFOUND' => array('code' => 62, 'msg' => 'Unable to load standout type information.'),
			'STANDOUT_PURCHASE_ERROR' => array('code' => 61, 'msg' => 'Standout strip purchase failed.'),
			
			'PREMIUM_TYPE_REQUIRED' => array('code' => 63, 'msg' => 'Premium type ID not specified.'),
			'PREMIUM_TYPE_NOTFOUND' => array('code' => 64, 'msg' => 'Unable to load premium type information.'),
			'PREMIUM_PURCHASE_ERROR' => array('code' => 65, 'msg' => 'Premium purchase failed.'),
			
			
	);

}


if ( ! function_exists('getErrorInfo'))
{
	function getErrorInfo($error)
	{
		$error_codes = ServiceErrorCodes::$error_codes;
		
		$array = array();
		
		if (isset($error_codes[$error])){
			
			$array['code'] = $error_codes[$error]['code'];
			$array['msg'] = $error_codes[$error]['msg'];
			
		}	
		else{
			
			$array['code'] = $error_codes['UNKNOWN_ERROR']['code'];
			$array['msg'] = $error_codes['UNKNOWN_ERROR']['msg'];
		}
		
		return $array;
	}
}

