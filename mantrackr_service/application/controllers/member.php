<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once('basecontroller.php');

class Member extends BaseController {

	
	public function login()
	{		
		if (!isset($_REQUEST['email']) || $_REQUEST['email'] == ''){
				
			$this->sresult->setErrorCode('EMAIL_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$email = $_REQUEST['email'];
		
		if (!isset($_REQUEST['password']) || $_REQUEST['password'] == ''){
		
			$this->sresult->setErrorCode('PASSWORD_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$password = $_REQUEST['password'];
		
		$this->processLogin($email, $password);
	}
	
	protected function processLogin($email, $password){
		
		$this->load->model('Member_model', 'member');
		
		if (!$this->member->loadByEmail($email)){
			$this->sresult->setErrorCode('INCORRECT_EMAIL_OR_PASSWORD');
			$this->sendJsonOutput();
			return;
		}	
		
		$encrypted_password = crypt($password, strtolower($this->member->getSalt()));
		
		
		if (!$this->member->loadByEmailAndPassword($email, $encrypted_password)){
			
			$this->sresult->setErrorCode('INCORRECT_EMAIL_OR_PASSWORD');
			$this->sendJsonOutput();
			return;
		}
		
		if (!$this->member->getActive()){
			
			if ($this->member->getIsBanned()){
				
				$this->sresult->setErrorCode('ACCOUNT_BANNED');
				$this->sendJsonOutput();
				return;
				
			}else {
				
				$this->sresult->setErrorCode('ACCOUNT_DEACTIVATED');
				$this->sendJsonOutput();
				return;
			}
		}
		
		$newToken = $this->member->generateNewToken();
		
		if (!$newToken){
			
			$this->sresult->setErrorCode('TOKEN_GENERATION_ERROR');
			$this->sendJsonOutput();
			return;
		}
		
		$this->member->setOnlineStatusOnFirebase(true);
		
		$this->member->loadMemberDetailInfo();
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setToken($newToken);
		$this->sresult->setMemberInfo($this->member->getData());
		
		$this->load->model('Membersettings_model', 'member_settings');
		
		$this->member_settings->loadByMemberId($this->member->getId());
		
		$this->sresult->setMemberSettings($this->member_settings->getData());
		
		$this->sendJsonOutput();
		
	}
	
	public function resetPassword(){
		
		if (!isset($_REQUEST['email']) || $_REQUEST['email'] == ''){
			
			$this->sresult->setErrorCode('EMAIL_REQUIRED');
			$this->sendJsonOutput();
			return;
		}	
		
		$this->load->helper('email');
		
		$email = $_REQUEST['email'];
		
		if (!valid_email($email)){
				
			$this->sresult->setErrorCode('INVALID_EMAIL');
			$this->sendJsonOutput();
			return;
		}
		
		$this->load->model('Member_model', 'member');
		
		if (!$this->member->loadByEmail($email)){
				
			$this->sresult->setErrorCode('EMAIL_NOT_REGISTERED');
			$this->sendJsonOutput();
			return;
		}

		$this->member->setDataChanges(false);
		
		$newPassword = $this->member->resetPassword();
		
		if (!$newPassword){
			$this->sresult->setErrorCode('PASSWORD_RESET_ERROR');
			$this->sendJsonOutput();
			return;	
		}
		
		mail($this->member->getEmail(), "Password has been reset for your mantrackr account.", "New Password - " . $newPassword);

		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
	public function getNearByMembers(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}

		if (!$this->member->loadNearByMembers()){
			
			$this->sresult->setErrorCode('MEMBER_SEARCH_FAILED');
			$this->sendJsonOutput();
			return;
			
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
	public function searchMembers(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		
		if (!isset($_REQUEST['query']) || $_REQUEST['query'] == ''){
			
			$this->sresult->setErrorCode('SEARCH_QUERY_NOT_FOUND');
			$this->sendJsonOutput();
			return;
		}	
		
		$search_query = trim($_REQUEST['query']);
		
		if (!$this->member->searchMembers($search_query)){
				
			$this->sresult->setErrorCode('MEMBER_SEARCH_FAILED');
			$this->sendJsonOutput();
			return;
				
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
	public function register()
	{
	
		if (!isset($_REQUEST['email']) || $_REQUEST['email'] == ''){
			
			$this->sresult->setErrorCode('EMAIL_REQUIRED');
			$this->sendJsonOutput();
			return;
		}	
		
		$email = $_REQUEST['email'];
		
		if (!isset($_REQUEST['password']) || $_REQUEST['password'] == ''){
				
			$this->sresult->setErrorCode('PASSWORD_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$password = $_REQUEST['password'];
		
		if (!isset($_REQUEST['confirm_password']) || $_REQUEST['confirm_password'] == '' || $password != $_REQUEST['confirm_password']){
		
			$this->sresult->setErrorCode('PASSWORD_MISMATCH');
			$this->sendJsonOutput();
			return;
		}
		

		$this->load->helper('email');
		
		if (!valid_email($email)){
			
			$this->sresult->setErrorCode('INVALID_EMAIL');
			$this->sendJsonOutput();
			return;
		}
		
		$this->load->model('Member_model', 'member');
		
		if ($this->member->loadByEmail($email)){
			
			$this->sresult->setErrorCode('EMAIL_ALREADY_REGISTERED');
			$this->sendJsonOutput();
			return;
		}
		
		
		$this->member->setEmail($email);
		$this->member->setSalt($email);
		
		$encrypted_password = crypt($password, strtolower($email));
		
		$this->member->setPassword($encrypted_password);
		
		$now = date("Y-m-d H:i:s");
		
		$this->member->setActivatedDate($now);
		$this->member->setCreatedDate($now);
		$this->member->setUpdatedDate($now);
		$this->member->setActive(1);
		
		$lat = isset($_REQUEST['lat']) ? $_REQUEST['lat'] + 0 : 0;
		$lng = isset($_REQUEST['lng']) ? $_REQUEST['lng'] + 0 : 0;
		$location = isset($_REQUEST['location']) ? $_REQUEST['location'] : '';
		
		
		$this->member->setLat($lat);
		$this->member->setLng($lng);
		$this->member->setLocation($location);
		
		if (!$this->member->save()){
			
			$this->sresult->setErrorCode('REG_DB_FAILURE');
			$this->sendJsonOutput();
			return;
		}
		
		$this->load->model("Membersettings_model", 'member_settings');
		
		$this->member_settings->loadDefaultSettings();
		$this->member_settings->setMemberId($this->member->getId());
		
		if (!$this->member_settings->save()){
			
			$this->sresult->setErrorCode('REG_DB_FAILURE');
			$this->sendJsonOutput();
			return;
		}
		
		$this->processLogin($email, $password);
		
	}
	
	public function logout()
	{
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		$this->member->memberLogout();
		
		$this->sresult->setErrorCode('SUCCESS');		
		$this->sendJsonOutput();
	}
	
	protected function checkTokenAndLoadMemberInfo(){
		
		if (!isset($_REQUEST['token']) || $_REQUEST['token'] == ''){
		
			$this->sresult->setErrorCode('TOKEN_REQUIRED');
			return false;
		}
		
		$token = $_REQUEST['token'];
		
		$this->load->model('Member_model', 'member');
		
		if (!$this->member->loadByToken($token)){
		
			$this->sresult->setErrorCode('TOKEN_INVALID');
			return false;
		}
		
		return true;
	}
	
	
	
	
	public function setPhotoPrivacy(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		if (!isset($_REQUEST['photo_id']) || $_REQUEST['photo_id'] == ''){
		
			$this->sresult->setErrorCode('PHOTO_ID_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$photo_id = $_REQUEST['photo_id'];
		
		
		if (!isset($_REQUEST['photo_privacy'])){
		
			$this->sresult->setErrorCode('PHOTO_PRIVACY_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$photo_privacy = ($_REQUEST['photo_privacy'] == 0) ? 0 : 1;
				
		$this->load->model('Photo_model', 'photo');
		
		if (!$this->photo->loadPhotoById($photo_id, $this->member->getId())){
			$this->sresult->setErrorCode('PHOTO_NOT_FOUND');
			$this->sendJsonOutput();
			return;
		}
		
		if (!$this->photo->setPhotoPrivacy($photo_privacy)){
			$this->sresult->setErrorCode('PHOTO_SET_PRIVACY_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
		
	}
	
	public function removePhoto(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		if (!isset($_REQUEST['photo_id']) || $_REQUEST['photo_id'] == ''){
		
			$this->sresult->setErrorCode('PHOTO_ID_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$photo_id = $_REQUEST['photo_id'];
		
		$this->load->model('Photo_model', 'photo');
		
		if (!$this->photo->loadPhotoById($photo_id, $this->member->getId())){
			$this->sresult->setErrorCode('PHOTO_NOT_FOUND');
			$this->sendJsonOutput();
			return;
		}
		
		if (!$this->photo->removePhoto()){
			$this->sresult->setErrorCode('PHOTO_REMOVE_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		if ($this->member->getPrimaryPhotoId() == $photo_id){
			$this->member->setPrimaryPhotoId(0);
			$this->member->save();
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
	
	
	public function saveCroppedTempPhoto(){
		
		header('Pragma: no-cache');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header("Cache-Control: no-cache, must-revalidate"); 
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		
		$timestamp = time();
		
		$new_file_name = "croppedPhoto_" . $timestamp . ".jpg";
		
		if (!is_dir($this->config->item('uploadDir') . "tmp/")) @mkdir($this->config->item('uploadDir') . "tmp/", 0777, true);
		
		$upload_file_path = $this->config->item('uploadDir') . "tmp/" . $new_file_name;
		
		$image_data = explode(",", $_POST['image']);
		
		$handle = fopen($upload_file_path, 'wb');
		
		if (!$handle || empty($image_data[1])){
			
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sendJsonOutput();
			return;	
		}
		
		fwrite($handle, base64_decode($image_data[1]));
		fclose($handle);
		
		$imgConfig['image_library'] = 'gd2';
		$imgConfig['source_image'] = $upload_file_path;
		$imgConfig['create_thumb'] = false;
		$imgConfig['maintain_ratio'] = false;
		$imgConfig['width'] = $_POST['width'];
		$imgConfig['height'] = $_POST['height'];
		$imgConfig['x_axis'] = $_POST['x'];
		$imgConfig['y_axis'] = $_POST['y'];
				 
		$this->load->library('image_lib', $imgConfig);
		
		if (!$this->image_lib->crop()){
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sresult->setMsg($this->image_lib->display_errors('', ''));
			$this->sendJsonOutput();
			return;
		}
		
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setPhotoUrl("tmp/" . $new_file_name);
		
		$this->sendJsonOutput();
	}
	
	public function uploadTempPhoto(){
		
		header('Pragma: no-cache');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		
		$action = $this->getInputValue('action');
		
		if ($action == 'save'){
			$this->saveCroppedTempPhoto();
			return;
		}
				
		$new_file_name = "tmpPhoto_" . time();
		
		$config['upload_path'] = $this->config->item('uploadDir') . "tmp/";
		
		if (!is_dir($config['upload_path'])) @mkdir($config['upload_path'], 0777, true);
		
		$config['allowed_types'] = 'gif|png|jpg';
		$config['file_name'] = $new_file_name;
		
		$this->load->library('upload', $config);
		
		if (!$this->upload->do_upload('ip-file')){
				
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sresult->setMsg($this->upload->display_errors('',''));
			$this->sendJsonOutput();
			return;
		}
		
		$upload_info = $this->upload->data();
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setPhotoUrl("tmp/" . $upload_info['file_name']);
		
		$this->sendJsonOutput();
	}
	
	
	public function replacePhoto(){
	
		header('Pragma: no-cache');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
	
		$replacePhotoId = $this->getInputValue('replacePhotoId');
	
		$this->load->model("Photo_model", "photo");
	
		if ($replacePhotoId == 0 || !$this->photo->loadById($replacePhotoId)){
				
			$this->sresult->setErrorCode('PHOTO_NOT_FOUND');
			$this->sendJsonOutput();
			return;
		}
	
		$cropped_photofile = $this->getInputValue("photo_file");
		
		$cropped_photopath =  $this->config->item('uploadDir') . $cropped_photofile;
		
		if ($cropped_photofile == '' || !is_file($cropped_photopath)){
				
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		
		$new_file_basename = "photo_" . time();
		$new_file_name = $new_file_basename . ".jpg";
		
		$upload_dir = $this->config->item('uploadDir') . $this->member->getId() . "/";
		
		if (!is_dir($upload_dir)) @mkdir($upload_dir, 0777, true);
		
		if (!copy($cropped_photopath, $upload_dir . $new_file_name)){
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		$thumbnail_filename = $new_file_basename . "_thumb.jpg";
		
		$imgConfig['image_library'] = 'gd2';
		$imgConfig['source_image'] = $upload_dir . $new_file_name;
		$imgConfig['target_image'] = $upload_dir . $thumbnail_filename;
		$imgConfig['create_thumb'] = true;
		$imgConfig['maintain_ratio'] = true;
		$imgConfig['width'] = 100;
		$imgConfig['height'] = 100;
		
		$this->load->library('image_lib', $imgConfig);
		
		if (!$this->image_lib->resize()){
			$this->sresult->setErrorCode('THUMBNAIL_CREATION_FAILED');
			$this->sresult->setMsg($this->image_lib->display_errors('', ''));
			$this->sendJsonOutput();
			return;
		}
		
		
		if (!$this->photo->replacePhoto($this->member->getId() . "/" . $new_file_name, $this->member->getId() . "/" . $thumbnail_filename)){
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		if ($replacePhotoId == $this->member->getPrimaryPhotoId()){
			
			$this->member->setPrimaryPhotoId($this->photo->getId());
			$this->member->setPrimaryPhotoApproved(0);
			$this->member->save();
			
		}
	
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setPhotoId($this->photo->getId());
		$this->sresult->setPhotoRecord($this->photo->getData());
		
		$this->sendJsonOutput();
		
	}
	
	
	public function uploadCroppedPhoto(){
		
		header('Pragma: no-cache');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		$cropped_photofile = $this->getInputValue("photo_file");
		
		$cropped_photopath =  $this->config->item('uploadDir') . $cropped_photofile;
		
		if ($cropped_photofile == '' || !is_file($cropped_photopath)){
			
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		
		$new_file_basename = "photo_" . time();
		$new_file_name = $new_file_basename . ".jpg";
		
		$upload_dir = $this->config->item('uploadDir') . $this->member->getId() . "/";
		
		if (!is_dir($upload_dir)) @mkdir($upload_dir, 0777, true);
		
		if (!copy($cropped_photopath, $upload_dir . $new_file_name)){
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		$thumbnail_filename = $new_file_basename . "_thumb.jpg";
		
		$imgConfig['image_library'] = 'gd2';
		$imgConfig['source_image'] = $upload_dir . $new_file_name;
		$imgConfig['target_image'] = $upload_dir . $thumbnail_filename;
		$imgConfig['create_thumb'] = true;
		$imgConfig['maintain_ratio'] = true;
		$imgConfig['width'] = 100;
		$imgConfig['height'] = 100;
		
		$this->load->library('image_lib', $imgConfig);
		
		if (!$this->image_lib->resize()){
			$this->sresult->setErrorCode('THUMBNAIL_CREATION_FAILED');
			$this->sresult->setMsg($this->image_lib->display_errors('', ''));
			$this->sendJsonOutput();
			return;
		}
		
		$this->load->model('Photo_model', 'newphoto');
		
		$this->newphoto->setMemberId($this->member->getId());
		$this->newphoto->setPath($this->member->getId() . "/" . $new_file_name);
		$this->newphoto->setIsPublic((isset($_REQUEST['is_public']) && $_REQUEST['is_public'] != '') ? $_REQUEST['is_public'] : 0);
		$this->newphoto->setSort(0);
		$this->newphoto->setUploadedDate(date("Y-m-d H:i:s"));
		$this->newphoto->setThumbPath($this->member->getId() . "/" . $thumbnail_filename);
		
		if (!$this->newphoto->save()){
			$this->sresult->setErrorCode('PHOTO_SAVE_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setPhotoId($this->newphoto->getId());
		$this->sresult->setPhotoRecord($this->newphoto->getData());
		
		$this->sendJsonOutput();
	}
	
	
	public function uploadPhoto(){
		
		/*header('Pragma: no-cache');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        header('X-Content-Type-Options: nosniff');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: OPTIONS, HEAD, GET, POST, PUT, DELETE');
        header('Access-Control-Allow-Headers: *');
		
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
        	$this->sendJsonOutput();
        	return;
        }*/
		
		header('Pragma: no-cache');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
        
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		$new_file_name = "photo_" . time();
				
		$config['upload_path'] = $this->config->item('uploadDir') . $this->member->getId() . "/";
		
		if (!is_dir($config['upload_path'])) @mkdir($config['upload_path'], 0777, true);
		
		$config['allowed_types'] = 'gif|png|jpg';
		$config['file_name'] = $new_file_name;
		
		$this->load->library('upload', $config);
		
		if (!$this->upload->do_upload('file')){
			
			$this->sresult->setErrorCode('UPLOAD_FAILED');
			$this->sresult->setMsg($this->upload->display_errors('',''));
			$this->sendJsonOutput();
			return;
		}
		
		$upload_info = $this->upload->data();
		
		$thumbnail_filename = $new_file_name . "_thumb" . $upload_info['file_ext'];
		
		$imgConfig['image_library'] = 'gd2';
		$imgConfig['source_image'] = $upload_info['full_path'];		
		$imgConfig['target_image'] = $upload_info['file_path'] . $thumbnail_filename;
		$imgConfig['create_thumb'] = true;
		$imgConfig['maintain_ratio'] = true;
		$imgConfig['width'] = 200;
		$imgConfig['height'] = 200;
		
		$this->load->library('image_lib', $imgConfig);
		
		if (!$this->image_lib->resize()){
			$this->sresult->setErrorCode('THUMBNAIL_CREATION_FAILED');
			$this->sresult->setMsg($this->image_lib->display_errors('', ''));
			$this->sendJsonOutput();
			return;
		}
			
		
		$this->load->model('Photo_model', 'newphoto');
		
		$this->newphoto->setMemberId($this->member->getId());
		$this->newphoto->setPath($this->member->getId() . "/" . $upload_info['file_name']);
		$this->newphoto->setIsPublic((isset($_REQUEST['is_public']) && $_REQUEST['is_public'] != '') ? $_REQUEST['is_public'] : 0);
		$this->newphoto->setSort(0);
		$this->newphoto->setUploadedDate(date("Y-m-d H:i:s"));
		$this->newphoto->setThumbPath($this->member->getId() . "/" . $thumbnail_filename);
		
		if (!$this->newphoto->save()){
			$this->sresult->setErrorCode('PHOTO_SAVE_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setPhotoId($this->newphoto->getId());
		$this->sresult->setPhotoRecord($this->newphoto->getData());
		
		$this->sendJsonOutput();
	}
	
	
	
	
	public function purchasePremium(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		$premium_type_id = $this->getInputValue("premium_type_id");
		
		if ($premium_type_id == ""){
			$this->sresult->setErrorCode('PREMIUM_TYPE_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		
		$this->load->model("Premiumtype_model", "premium_type");
		
		if (!$this->premium_type->loadById($premium_type_id)){
				
			$this->sresult->setErrorCode('PREMIUM_TYPE_NOTFOUND');
			$this->sendJsonOutput();
			return;
		}
		
		$this->load->model("Premiumpurchase_model");
		
		$purchase_record = $this->member->purchasePremiumMembership($this->premium_type);
		
		if (!$purchase_record){
				
			$this->sresult->setErrorCode('PREMIUM_PURCHASE_ERROR');
			$this->sendJsonOutput();
			return;
				
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setPurchaseRecord($purchase_record->getData());
		
		$this->sendJsonOutput();
		
	}
	
	public function purchaseStandout(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}

		$standout_type_id = $this->getInputValue("standout_type_id");
		
		if ($standout_type_id == ""){
			$this->sresult->setErrorCode('STANDOUT_TYPE_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		
		$this->load->model("Standouttype_model", "standout_type");
		
		if (!$this->standout_type->loadById($standout_type_id)){
			
			$this->sresult->setErrorCode('STANDOUT_TYPE_NOTFOUND');
			$this->sendJsonOutput();
			return;
		}
		
		$this->load->model("Standoutpurchase_model");
		
		$purchase_record = $this->member->purchaseStandoutStrip($this->standout_type);
		
		if (!$purchase_record){
			
			$this->sresult->setErrorCode('STANDOUT_PURCHASE_ERROR');
			$this->sendJsonOutput();
			return;
			
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sresult->setPurchaseRecord($purchase_record->getData());
		
		$this->sendJsonOutput();
	}
	
	public function updateSettings(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}

		$this->load->model("Membersettings_model", "member_settings");
		
		if (!$this->member_settings->loadByMemberId($this->member->getId())){
			$this->sresult->setErrorCode('SETTINGS_NOT_FOUND');
			$this->sendJsonOutput();
			return;
		}
				
		if (isset($_REQUEST['menu_order']) && $_REQUEST['menu_order'] != '')
			$this->member_settings->setMenuOrder($_REQUEST['menu_order']);
		
		if (!$this->member_settings->save()){
			$this->sresult->setErrorCode('UPDATE_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
	public function changePassword(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		if (!isset($_REQUEST['currentPassword']) || $_REQUEST['currentPassword'] == ''){
		
			$this->sresult->setErrorCode('CURRENT_PASSWORD_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$currentPassword = $_REQUEST['currentPassword'];
		
		if (!isset($_REQUEST['newPassword']) || $_REQUEST['newPassword'] == ''){
		
			$this->sresult->setErrorCode('NEW_PASSWORD_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$newPassword = $_REQUEST['newPassword'];
		
		if ($this->member->getPassword() != crypt($currentPassword, strtolower($this->member->getSalt()))){
			
			$this->sresult->setErrorCode('CURRENT_PASSWORD_INCORRECT');
			$this->sendJsonOutput();
			return;
		}
		
		if (!$this->member->changePassword($newPassword)){
			
			$this->sresult->setErrorCode('PASSWORD_CHANGE_ERROR');
			$this->sendJsonOutput();
			return;
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
	
	public function changeEmail(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		if (!isset($_REQUEST['newEmail']) || $_REQUEST['newEmail'] == ''){
		
			$this->sresult->setErrorCode('NEW_EMAIL_REQUIRED');
			$this->sendJsonOutput();
			return;
		}
		
		$newEmail = $_REQUEST['newEmail'];
		
		$this->load->helper('email');
		
		if (!valid_email($newEmail)){
		
			$this->sresult->setErrorCode('INVALID_EMAIL');
			$this->sendJsonOutput();
			return;
		}
		
		
		$changeResult = $this->member->changeEmail($newEmail);
		
		if ($changeResult === -1){
			
			$this->sresult->setErrorCode('EMAIL_CHANGE_ERROR');
			$this->sendJsonOutput();
			return;
		}
		
		
		if ($changeResult === -2){
				
			$this->sresult->setErrorCode('EMAIL_ALREADY_REGISTERED');
			$this->sendJsonOutput();
			return;
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
	public function updateProfile(){
		
		if (!$this->checkTokenAndLoadMemberInfo()){
			$this->sendJsonOutput();
			return;
		}
		
		$this->member->setDataChanges(false);
		
		if (isset($_REQUEST['name']) && $_REQUEST['name'] != '')
			$this->member->setName($_REQUEST['name']);
		
		if (isset($_REQUEST['age']) && $_REQUEST['age'] != '')
			$this->member->setAge($_REQUEST['age']);
		
		if (isset($_REQUEST['height']) && $_REQUEST['height'] != '')
			$this->member->setHeight($_REQUEST['height']);
		
		if (isset($_REQUEST['weight']) && $_REQUEST['weight'] != '')
			$this->member->setWeight($_REQUEST['weight']);
		
		if (isset($_REQUEST['ethnicity_id']) && $_REQUEST['ethnicity_id'] != '')
			$this->member->setEthnicityId($_REQUEST['ethnicity_id']);
		
		if (isset($_REQUEST['relationship_status_id']) && $_REQUEST['relationship_status_id'] != '')
			$this->member->setRelationshipStatusId($_REQUEST['relationship_status_id']);
		
		if (isset($_REQUEST['opento_ids']))
			$this->member->setOpentoIds($_REQUEST['opento_ids']);
		
		if (isset($_REQUEST['lookingfor']))
			$this->member->setLookingfor($_REQUEST['lookingfor']);
		
		if (isset($_REQUEST['description']))
			$this->member->setDescription($_REQUEST['description']);
		
		if (isset($_REQUEST['interests']))
			$this->member->setInterests($_REQUEST['interests']);
		
		if (isset($_REQUEST['location']) && $_REQUEST['location'] != '')
			$this->member->setLocation($_REQUEST['location']);
		
		if (isset($_REQUEST['lat']) && $_REQUEST['lat'] != '')
			$this->member->setLat($_REQUEST['lat']);
		
		if (isset($_REQUEST['lng']) && $_REQUEST['lng'] != '')
			$this->member->setLng($_REQUEST['lng']);
		
		if (isset($_REQUEST['primary_photo']) && $_REQUEST['primary_photo'] != '')
			$this->member->setPrimaryPhotoId($_REQUEST['primary_photo']);
		
		if (!$this->member->save()){
			$this->sresult->setErrorCode('UPDATE_FAILED');
			$this->sendJsonOutput();
			return;
		}
		
		$this->sresult->setErrorCode('SUCCESS');
		$this->sendJsonOutput();
	}
	
}
