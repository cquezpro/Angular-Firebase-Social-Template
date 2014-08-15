<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once('basecontroller.php');

class Admin extends BaseController {
	
	
	public function __construct(){
		
		parent::__construct();
		
		$this->load->model('Member_model', 'member');
		$this->load->library('session');
		$this->load->helper('url');
		
		if ($this->session->userdata('user_id')){
			
			$this->member->loadById($this->session->userdata('user_id'));
		}		
	}
	
	public function index(){
		
		$this->checkLogin();
		
		$this->redirectPage('/admin/dashboard');
		
	}
	
	public function getEthnicityConstList(){
		
		$this->load->model('Const_model', 'const');
		
		$ethnicity_list = $this->const->getEthnicityList();
		
		$this->sresult->setResults($ethnicity_list);
		
		$this->sresult->setErrorCode('SUCCESS');
		
		$this->sendJsonOutput();
		
	}
	
	public function getOpentoOptionList(){
		
		$this->load->model('Const_model', 'const');
		
		$opento_option_list = $this->const->getOpentoOptionList();
		
		$this->sresult->setResults($opento_option_list);
		
		$this->sresult->setErrorCode('SUCCESS');
		
		$this->sendJsonOutput();
		
	}
	
	public function getRelationshipStatusList(){
	
		$this->load->model('Const_model', 'const');
	
		$relationship_status_list = $this->const->getRelationshipStatusList();
	
		$this->sresult->setResults($relationship_status_list);
	
		$this->sresult->setErrorCode('SUCCESS');
	
		$this->sendJsonOutput();
	
	}
	
	public function dashboard(){
		
		$this->checkLogin();
		
		$data = $this->setCommonViewVariables('Dashboard');
		
		$data['css_list'][] = assets_url() . "/js/plugins/icheck/skins/minimal/blue.css";
		$data['css_list'][] = assets_url() . "/js/plugins/select2/select2.css";
		
		
		$data['js_list'][] = assets_url() . "/js/plugins/icheck/jquery.icheck.min.js";
		$data['js_list'][] = assets_url() . "/js/plugins/select2/select2.js";
		$data['js_list'][] = assets_url() . "/js/plugins/tableCheckable/jquery.tableCheckable.js";
		$data['js_list'][] = assets_url() . "/js/libs/raphael-2.1.2.min.js";
		$data['js_list'][] = assets_url() . "/js/plugins/morris/morris.min.js";
		$data['js_list'][] = assets_url() . "/js/demos/charts/morris/donut.js";
		$data['js_list'][] = assets_url() . "/js/plugins/sparkline/jquery.sparkline.min.js";
		$data['js_list'][] = assets_url() . "/js/plugins/fullcalendar/fullcalendar.min.js";
		$data['js_list'][] = assets_url() . "/js/demos/calendar.js";
		$data['js_list'][] = assets_url() . "/js/demos/dashboard.js";
		
		$this->load->view('admin/dashboard', $data);
	}
	
	public function members(){
		
		$this->checkLogin();
		
		$data = $this->setCommonViewVariables('Members');
		
		$data['css_list'][] = assets_url() . "/js/plugins/icheck/skins/minimal/blue.css";
		$data['css_list'][] = assets_url() . "/js/plugins/magnific/magnific-popup.css";
				
		$data['js_list'][] = assets_url() . "/js/plugins/datatables/jquery.dataTables.min.js";
		$data['js_list'][] = assets_url() . "/js/plugins/datatables/DT_bootstrap.js";
		$data['js_list'][] = assets_url() . "/js/plugins/tableCheckable/jquery.tableCheckable.js";
		$data['js_list'][] = assets_url() . "/js/plugins/icheck/jquery.icheck.min.js";
		$data['js_list'][] = assets_url() . "/js/plugins/magnific/jquery.magnific-popup.min.js";
		
		$data['searchQuery'] = $this->input->get('s');
		
		$this->load->view('admin/members', $data);
	}
	
	
	public function member(){

		$this->checkLogin();
		
		$member_id = $this->getInputValue('memberId');
		
		$this->load->model('Member_model', 'member');
		
		if (!$this->member->loadById($member_id)){
			die("Unable to find member.");
			exit;
		}
		
		$images = $this->member->loadImages();
		$flags = $this->member->loadFlags();
		
		$data = $this->setCommonViewVariables('Member');
		
		$data['css_list'][] = assets_url() . "/js/plugins/magnific/magnific-popup.css";
		$data['js_list'][] = assets_url() . "/js/plugins/magnific/jquery.magnific-popup.min.js";
		
		$data['member'] = $this->member;
		$data['member_images'] = $images;
		$data['member_flags'] = $flags;
		$data['member_premium_purchase_history'] = $this->member->loadPremiumPurchaseHistory();
		$data['member_standout_purchase_history'] = $this->member->loadStandoutStripPurchaseHistory();
		
		$this->load->view('admin/member', $data);
	}
	
	
	public function flaggedMembers(){
		
		$this->checkLogin();
		
		$num = $this->getInputValue('num');
		
		if ($num == '' || $num == 0) $num = 1;
		
		$data = $this->setCommonViewVariables('Flagged Members');
		
				
		if ($data['flaggedMembersNum'] == 0){ 
			
			$data['no_member'] = true;
		}
		else {
			$data['no_member'] = false;
		}
		
		if ($num > 1) $data['prev_exists'] = true;
		else $data['prev_exists'] = false;
		
		if ($num < $data['flaggedMembersNum']) $data['next_exists'] = true;
		else $data['next_exists'] = false;
		
		
		$this->load->model('Member_model', 'member');
		
		if (!$this->member->loadNthFlaggedMember($num)){
			die("Unable to find member.");
			exit;
		}
		
		$images = $this->member->loadImages();
		$flags = $this->member->loadFlags();
		
		$data['css_list'][] = assets_url() . "/js/plugins/magnific/magnific-popup.css";
		$data['js_list'][] = assets_url() . "/js/plugins/magnific/jquery.magnific-popup.min.js";
		
		$data['member'] = $this->member;
		$data['member_images'] = $images;
		$data['member_flags'] = $flags;
		
		$data['num'] = $num;
		
		$this->load->view('admin/flaggedMembers', $data);
	}
	
	public function replacePhoto(){
		
		header('Pragma: no-cache');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
		
		$this->checkLogin();
		
		$replacePhotoId = $this->getInputValue('replacePhotoId');
		
		$this->load->model("Photo_model", "photo");
		
		if ($replacePhotoId == 0 || !$this->photo->loadById($replacePhotoId)){
			
			$this->addFlashMessage(2, "Unable to find photo information. Try again.", "Photo Replacement");
			$this->redirectPage('/admin/pendingPhotos');
			exit;
		}
		
		$replaceMemberId = $this->getInputValue("replaceMemberId");
		
		if ($replaceMemberId == ''){
			
			$this->addFlashMessage(2, "Unable to find member id. Try again.", "Photo Replacement");
			$this->redirectPage('/admin/pendingPhotos');
			exit;
		}
		
		$new_file_name = "photo_" . time();
		
		$config['upload_path'] = $this->config->item('uploadDir') . $replaceMemberId . "/";
		
		if (!is_dir($config['upload_path'])) @mkdir($config['upload_path'], 0777, true);
		
		$config['allowed_types'] = 'gif|png|jpg';
		$config['file_name'] = $new_file_name;
		
		$this->load->library('upload', $config);
		
		if (!$this->upload->do_upload('replaceFile')){
				
			$this->addFlashMessage(2, "Unable to upload new photo. Try again.", "Photo Replacement");
			$this->redirectPage('/admin/pendingPhotos');
			exit;
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
			$this->addFlashMessage(2, "Unable to generate thumbnail. Try again.", "Photo Replacement");
			$this->redirectPage('/admin/pendingPhotos');
			exit;
		}
			
		if (!$this->photo->replacePhoto($replaceMemberId . "/" . $upload_info['file_name'], $replaceMemberId . "/" . $thumbnail_filename)){
			$this->addFlashMessage(2, "Unable to replace photo. Try again.", "Photo Replacement");
			$this->redirectPage('/admin/pendingPhotos');
			exit;
		}
		
		$this->addFlashMessage(0, "Successfully replaced photo.", "Photo Replacement");
		$this->redirectPage('/admin/pendingPhotos');
	}
	
	public function pendingPhotos(){
		
		$this->checkLogin();
		
		$data = $this->setCommonViewVariables('Member');
		
		$data['css_list'][] = assets_url() . "/js/plugins/fileupload/bootstrap-fileupload.css";
		$data['css_list'][] = assets_url() . "/js/plugins/magnific/magnific-popup.css";
		
		$data['js_list'][] = assets_url() . "/js/plugins/fileupload/bootstrap-fileupload.js";
		$data['js_list'][] = assets_url() . "/js/plugins/magnific/jquery.magnific-popup.min.js";
		
		
		$this->load->model('Member_model', 'member');
		
		$pendingPhotoMembers = $this->member->getPendingPhotosMembers();
		
		foreach($pendingPhotoMembers as $key => $val)
			$pendingPhotoMembers[$key]['created_time_ago'] = time_elapsed_string($val['created_date']);
		
		$data['members'] = $pendingPhotoMembers;
		
		$this->load->view('admin/pendingPhotos', $data);
	}
	
	public function downloadPhoto(){
		
		$this->checkLogin();
		
		$photo_id = $this->getInputValue("photo_id");
		
		$this->load->model('Photo_model', 'photo');
		
		if ($photo_id == '' || !$this->photo->loadById($photo_id)){
			die("Unable to find photo.");
			exit;
		}
		
		$filename = basename($this->photo->getPath());
		
		header('Content-Disposition: attachment; filename="' . $filename . '"');
		
		$photo_upload_dir = $this->config->item("uploadDir");
		
		readfile($photo_upload_dir . $this->photo->getPath());
		
	}
	
	public function deleteMember(){
		
		$this->checkLogin();
		
		$member_id = $this->getInputValue("member_id");
		
		if ($member_id == '' || !$this->member->loadById($member_id)){
			die("Unable to find member.");
			exit;
		}
		
		$this->member->setIsBanned(1);
		$this->member->setActive(0);
		
		if ($this->member->save()){
			$this->addFlashMessage(0, "Successfully deleted!", "Member deletion");
		}else{
			$this->addFlashMessage(2, "Unable to delete member. Try again.", "Member deletion");
		}
		
		$back_page = $this->getInputValue("back_page");
		
		if ($back_page == '') $back_page = "/admin/members";
		
		$this->redirectPage($back_page);
	}
	
	public function upgradeMemberPremium(){
		
		$this->checkLogin();
		
		$member_id = $this->getInputValue("memberId");
				
		if ($member_id == '' || !$this->member->loadById($member_id)){
			die("Unable to find member.");
			exit;
		}
		
		$premium_type_id = $this->getInputValue("premiumTypeId");
		
		$this->load->model("Premiumtype_model", "premium_type");
		
		if (!$this->premium_type->loadById($premium_type_id)){
		
			die("Premium type invalid.");
			exit;
		}

		$this->load->model("Premiumpurchase_model");
		
		if ($this->member->purchasePremiumMembership($this->premium_type))
			$this->addFlashMessage(0, "Successfully upgraded!", "Premium Upgrade");
		else
			$this->addFlashMessage(2, "Upgrade Error!", "Premium Upgrade");
		
		$this->redirectPage('/admin/member?memberId=' . $member_id);
	}
	
	
	public function upgradeMemberStandoutStrip(){
		
		$this->checkLogin();
		
		$member_id = $this->getInputValue("memberId");
		
		if ($member_id == '' || !$this->member->loadById($member_id)){
			die("Unable to find member.");
			exit;
		}
		
		$standout_type_id = $this->getInputValue("standoutTypeId");
		
		$this->load->model("Standouttype_model", "standout_type");
		
		if (!$this->standout_type->loadById($standout_type_id)){
		
			die("Standout type invalid.");
			exit;
		}
		
		$this->load->model("Standoutpurchase_model");
		
		if ($this->member->purchaseStandoutStrip($this->standout_type))
			$this->addFlashMessage(0, "Successfully upgraded!", "Standout Strip Upgrade");
		else
			$this->addFlashMessage(2, "Upgrade Error!", "Standout Strip Upgrade");
		
		$this->redirectPage('/admin/member?memberId=' . $member_id);
		
	}
	
	public function approveMemberPhoto(){

		$this->checkLogin();
		
		$member_id = $this->getInputValue("member_id");
		
		if ($member_id == '' || !$this->member->loadById($member_id)){
			die("Unable to find member.");
			exit;
		}
		
		$this->member->setPrimaryPhotoApproved(1);
		
		if ($this->member->save()){
			$this->addFlashMessage(0, "Successfully approved!", "Photo approvement");
		}else{
			$this->addFlashMessage(2, "Unable to approve member photo. Try again.", "Photo approvement");
		}	
		
		$this->redirectPage('/admin/pendingPhotos');
	}
	
	public function declineMemberPhoto(){
	
		$this->checkLogin();
	
		$member_id = $this->getInputValue("member_id");
	
		if ($member_id == '' || !$this->member->loadById($member_id)){
			die("Unable to find member.");
			exit;
		}
	
		$this->member->setPrimaryPhotoApproved(0);
		$this->member->setPrimaryPhotoId(0);
	
		if ($this->member->save()){
			$this->addFlashMessage(0, "Successfully declined!", "Photo decline");
		}else{
			$this->addFlashMessage(2, "Unable to decline member photo. Try again.", "Photo decline");
		}
	
		$this->redirectPage('/admin/pendingPhotos');
	}
	
	
	public function mailboard(){
		
		$this->checkLogin();
		
		$data = $this->setCommonViewVariables('Member');
		
		$this->load->view('admin/mailboard', $data);
		
	}
	
	public function deactivateAd(){
		
		$this->checkLogin();
		
		$this->load->model('Ad_model', 'ad');
		
		$ad_id = $this->getInputValue("ad_id");
		
		if ($ad_id == 0) $this->redirectPage('/admin/adalertManage'); 
	
		if (!$this->ad->loadById($ad_id)) $this->redirectPage('/admin/adalertManage');
		
		$this->ad->setIsActive(0);
		
		$this->ad->save();
		
		$this->addFlashMessage(0, "Successfully De-Activated!", "Deactivation");
		$this->redirectPage('/admin/adalertManage?currentAd='.$this->ad->getId());
	}
	
	public function activateAd(){
		
		$this->checkLogin();
		
		$this->load->model('Ad_model', 'ad');
		
		$ad_id = $this->getInputValue("ad_id");
		
		if ($ad_id == 0) $this->redirectPage('/admin/adalertManage');
		
		if (!$this->ad->loadById($ad_id)) $this->redirectPage('/admin/adalertManage');
		
		$this->ad->setIsActive(1);
		
		$this->ad->save();
		
		$this->addFlashMessage(0, "Successfully Activated!", "Activation");
		$this->redirectPage('/admin/adalertManage?currentAd='.$this->ad->getId());
	}
	
	public function deleteAd(){
	
		$this->checkLogin();
	
		$this->load->model('Ad_model', 'ad');
	
		$ad_id = $this->getInputValue("ad_id");
	
		if ($ad_id == 0) $this->redirectPage('/admin/adalertManage');
	
		if (!$this->ad->loadById($ad_id)) $this->redirectPage('/admin/adalertManage');
	
		$this->ad->deleteAd();
	
		$this->addFlashMessage(0, "Successfully removed!", "Remove");
		$this->redirectPage('/admin/adalertManage');
	}
	
	
	public function saveAd(){
		
		$this->checkLogin();
		
		$this->load->model('Ad_model', 'ad');		
		
		$ad_id = $this->getInputValue("ad_id");
		
		if ($ad_id != 0) $this->ad->loadById($ad_id);
		
		$ad_title = $this->getInputValue("ad_title");
		if ($ad_title == ''){
			
			$this->addFlashMessage(2, 'Ad title can not be blank.', 'Save Error');
			$this->redirectPage('/admin/adalertManage');			
		}
		$this->ad->setTitle($ad_title);
		
		$ad_content = $this->getInputValue("ad_content");
		if ($ad_content == ''){
				
			$this->addFlashMessage(2, 'Ad content can not be blank.', 'Save Error');
			$this->redirectPage('/admin/adalertManage');
		}
		$this->ad->setContent($ad_content);
		
		$ad_startDate = $this->getInputValue("ad_startdate");
		
		if ($ad_startDate != '')
			$ad_startDate = date("Y-m-d", strtotime($ad_startDate));
		
		$this->ad->setStartdate($ad_startDate);
		
		$ad_noEndDate = $this->getInputValue("noenddate_chk");
		$this->ad->setNoenddate($ad_noEndDate);
		
		if ($ad_noEndDate)
			$ad_enddate = '';
		else
			$ad_enddate = $this->getInputValue("ad_enddate");
		
		if ($ad_enddate != '')
			$ad_enddate = date("Y-m-d", strtotime($ad_enddate));
		
		$this->ad->setEnddate($ad_enddate);
		
		
		$this->ad->setShowOnStartup($this->getInputValue("show_on_startup_chk"));
		$this->ad->setShowOnAfterblock($this->getInputValue("show_on_afterblock_chk"));
		$this->ad->setShowOnBetweenpages($this->getInputValue("show_on_betweenpages_chk"));
		$this->ad->setShowOnAfterlogout($this->getInputValue("show_on_afterlogout_chk"));
		$this->ad->setShowOnAfterclosingprofile($this->getInputValue("show_on_afterclosingprofile_chk"));
		$this->ad->setShowOnFirstlogin($this->getInputValue("show_on_firstlogin_chk"));
		
		$this->ad->setMembergroupId($this->getInputValue('ad_membergroup_id'));
		
		$ad_topButtonLabel = $this->getInputValue("ad_topbutton_label");
		if ($ad_topButtonLabel == ''){
			$this->addFlashMessage(2, 'Tob button label can not be blank.', 'Save Error');
			$this->redirectPage('/admin/adalertManage');
		}
		$this->ad->setTopbuttonLabel($ad_topButtonLabel);
		
		
		$ad_bottomButtonLabel = $this->getInputValue("ad_bottombutton_label");
		if ($ad_bottomButtonLabel == ''){
			$this->addFlashMessage(2, 'Bottom button label can not be blank.', 'Save Error');
			$this->redirectPage('/admin/adalertManage');
		}
		$this->ad->setBottombuttonLabel($ad_bottomButtonLabel);
		
		$this->ad->setTopbuttonGoPageid($this->getInputValue('ad_topbutton_pageid'));
		
		/*photo upload*/
		
		if (isset($_POST['ad_topImage']) && $_POST['ad_topImage'] == ''){
			$this->ad->replaceAdTopImage('');
		}
		
		if (isset($_POST['ad_backImage']) && $_POST['ad_backImage'] == ''){
			$this->ad->replaceAdBackImage('');
		}
		
		$new_topimage_filename = "ad_" . time() . "_top";
		
		$config['upload_path'] = $this->config->item('adUploadDir');
		
		if (!is_dir($config['upload_path'])) @mkdir($config['upload_path'], 0777, true);
		
		$config['allowed_types'] = 'gif|png|jpg';
		$config['file_name'] = $new_topimage_filename;
		
		$this->load->library('upload', $config);
		
		if ($this->upload->do_upload('ad_topImage')){
			$upload_info = $this->upload->data();
			$this->ad->replaceAdTopImage($upload_info['file_name']);
		}
		
		$new_backimage_filename = "ad_" . time() . "_back";
		$config['file_name'] = $new_backimage_filename;
		
		$this->upload->initialize($config);
		
		if ($this->upload->do_upload('ad_backImage')){
			$upload_info = $this->upload->data();
			$this->ad->replaceAdBackImage($upload_info['file_name']);
		}
		
		if (!$this->ad->save()){
			$this->addFlashMessage(2, 'Unable to save ad information to db.', 'Save Error');
			$this->redirectPage('/admin/adalertManage');
		}
		
		$this->addFlashMessage(0, "Successfully saved!", "Success");
		$this->redirectPage('/admin/adalertManage?currentAd='.$this->ad->getId());
	}
	
	public function adalertManage(){
		
		$this->checkLogin();
		
		$data = $this->setCommonViewVariables('Manage Ads/Alerts');
		
		$current_ad_id = $this->getInputValue("currentAd");
		
		if ($current_ad_id == '') $current_ad_id = 0;
		
		$data['css_list'][] = assets_url() . "/js/plugins/fileupload/bootstrap-fileupload.css";
		$data['css_list'][] = assets_url() . "/js/plugins/datepicker/datepicker.css";
		$data['css_list'][] = assets_url() . "/js/plugins/icheck/skins/minimal/blue.css";
		
		$data['js_list'][] = assets_url() . "/js/plugins/fileupload/bootstrap-fileupload.js";
		$data['js_list'][] = assets_url() . "/js/plugins/datepicker/bootstrap-datepicker.js";
		$data['js_list'][] = assets_url() . "/js/plugins/icheck/jquery.icheck.js";
		$data['js_list'][] = assets_url() . "/js/plugins/parsley/parsley.js";
		
		$data['membergroup_list'] = $this->member->getMemberGroupList();
		
		$this->load->model('Ad_model', 'ad');
		$data['page_list'] = $this->ad->getPageList();
		
		$data['ad_list'] = $this->ad->loadAllAds();
		$data['ad_upload_url'] = base_url() . $this->config->item('adUploadURL');
		
		$data['current_ad_id'] = $current_ad_id + 0;
		
		$this->load->view('admin/adalertManage', $data);
		
	}
	
	
	public function exportPremiumMembers(){
		
		$this->checkLogin();
		
		$members = $this->member->loadPremiumMembers();
		
		$this->exportMemberEmailList($members, 'Premium Members_' . time() . '.csv');
	}
	
	public function exportFreemiumMembers(){
		
		$this->checkLogin();
		
		$members = $this->member->loadFreemiumMembers();
		
		$this->exportMemberEmailList($members, 'Freemium Members_' . time() . '.csv');
	}
	
	public function exportInactiveMembers(){
	
		$this->checkLogin();
	
		$members = $this->member->loadInactiveMembers();
	
		$this->exportMemberEmailList($members, 'Inactive Members_' . time() . '.csv');
	}
	
	public function exportCanceledMembers(){
	
		$this->checkLogin();
	
		$members = $this->member->loadCanceledMembers();
	
		$this->exportMemberEmailList($members, 'Canceled Members_' . time() . '.csv');
	}
	
	public function exportPremiumExpMembers(){
	
		$this->checkLogin();
	
		$members = $this->member->loadPremiumExpirationMembers();
	
		$this->exportMemberEmailList($members, 'Premium Expiration Members_' . time() . '.csv');
	}
	
	public function exportPremiumCancelMembers(){
	
		$this->checkLogin();
	
		$members = $this->member->loadPremiumCancelMembers();
	
		$this->exportMemberEmailList($members, 'Premium Cancelation Members_' . time() . '.csv');
	}
	
	
	protected function exportMemberEmailList($members, $filename){
		
		header('Content-Type: application/csv');
		header('Content-Disposition: attachement; filename="'.$filename.'";');
		
		$f = fopen('php://output', 'w');
		
		fputcsv($f, array('Member name', 'Email Address'), ",");
		
		foreach($members as $member)
			fputcsv($f, array($member['name'], $member['email']), ",");
	}
	
	public function visitorStats(){
		
		$this->checkLogin();
		
		$data = $this->setCommonViewVariables('Visitor Stats');
		
		$this->load->view('admin/visitorStats', $data);
	}
	
	public function login(){
		
		$messages = $this->readFlashMessages();
		
		$this->load->view('admin/login', array('messages' => $messages));	
	}
	
	public function logout(){
		
		$this->session->unset_userdata('user_id');
		$this->session->unset_userdata('user_email');
		$this->session->unset_userdata('user_name');

		$this->redirectToLoginPage();
	}
	
	public function processLogin(){
		
		$email = $this->input->post('login-email');
		$password = $this->input->post('login-password');
		
		if (!$email){
			$this->addFlashMessage(2, "User email is required.", 'Login Failed');
			$this->redirectToLoginPage();
		}
		
		if (!$password){
			$this->addFlashMessage(2, "Password is required.", 'Login Failed');
			$this->redirectToLoginPage();
		}
		
		$encrypted_password = crypt($password, strtolower($email));
		
		if (!$this->member->loadByEmailAndPassword($email, $encrypted_password) || !$this->member->getIsAdmin()){
			$this->addFlashMessage(2, "Invalid login information.", 'Login Failed');
			$this->redirectToLoginPage();
		}
		
		$session_info = array('user_id' => $this->member->getId(), 'user_email' => $this->member->getEmail(), 'user_name' => $this->member->getName());

		$this->session->set_userdata($session_info);
		
		$this->redirectToHomePage();
		
	}
	
	public function getCrucialMetrics(){
		
		$rangeIndex = $this->getInputValue('rangeIndex');
		
		$this->load->model('Report_model', 'report');
		
		$results = $this->report->getCrucialMetrics($rangeIndex);
		
		$this->sresult->setResults($results);
		
		$this->sresult->setErrorCode('SUCCESS');
		
		$this->sendJsonOutput();
	}
	
	public function getPurchaseVolumnChartData(){
		
		$stepIndex = $this->getInputValue('stepIndex');
		
		$this->load->model('Report_model', 'report');
		
		$results = $this->report->getPurchaseVolumnChartData($stepIndex);
		
		$this->sresult->setResults($results);
		
		$this->sresult->setErrorCode('SUCCESS');
		
		$this->sendJsonOutput();
	}
	
	public function getGrossRevenueChartData(){

		$stepIndex = $this->getInputValue('stepIndex');
		
		$this->load->model('Report_model', 'report');
		
		$results = $this->report->getGrossRevenueChartData($stepIndex);
		
		$this->sresult->setResults($results);
		
		$this->sresult->setErrorCode('SUCCESS');
		
		$this->sendJsonOutput();
		
	}
	
	
	public function getPurchaseSelectionChartData(){

		$stepIndex = $this->getInputValue('stepIndex');
		$purchaseTypeIndex = $this->getInputValue('purchaseTypeIndex');
		
		$this->load->model('Report_model', 'report');
		
		$results = $this->report->getPurchaseSelectionChartData($stepIndex, $purchaseTypeIndex);
		
		$this->sresult->setResults($results);
		
		$this->sresult->setErrorCode('SUCCESS');
		
		$this->sendJsonOutput();
	}
	
	public function getMembershipAreaChartData(){
		
		$stepIndex = $this->getInputValue('stepIndex');
		
		$this->load->model('Report_model', 'report');
		
		$results = $this->report->getMembershipAreaChartData($stepIndex);
		
		$this->sresult->setResults($results);
		
		$this->sresult->setErrorCode('SUCCESS');
		
		$this->sendJsonOutput();
	}
	
	public function getAllMembersTable(){
		
		$members = $this->member->loadAllMembers();
	
		$results = array();
		
		$results['aaData'] = array();
		
		foreach($members as $member){

			$newRow = array();
			
			//$newRow[] = '';
			
			if ($member['path'] == '')
				$newRow[] = assets_url('/img/avatars/noimage.jpg');
			else {
				if ($member['primary_photo_approved'] == 0)
					$newRow[] =  assets_url('/img/avatars/pendingPhoto.png');
				else
					$newRow[] = base_url() . $this->config->item('uploadURL') . $member['path'];
			}
			
			$newRow[] = array($member['name'], $member['email'], $member['id']);
			$newRow[] = $member['location'];
			$newRow[] = date("m-d-Y / H.i", strtotime($member['created_date']));
			$newRow[] = $member['is_premium'];
			$newRow[] = $member['primary_photo_approved'];
			$newRow[] = $member['is_banned'];
			$newRow[] = '';
			
			$results['aaData'][] = $newRow;
		}
		
		echo json_encode($results);
	}
		
	private function setCommonViewVariables($page_title = ''){
		
		$data = array();
		
		$data['page_title'] = $page_title;
		$data['session'] = array();
		
		$session_id_list = array('user_id', 'user_email', 'user_name');
		
		foreach($session_id_list as $id)
			$data['session'][$id] = $this->session->userdata($id);
		
		$data['js_list'] = array();
		$data['css_list'] = array();
		
		$data['current_controller'] = $this->router->class;
		$data['current_method'] = $this->router->method;
		
		$data['current_action'] = $data['current_controller'] . "_" . $data['current_method'];
		
		$data['upload_url'] = base_url() . $this->config->item('uploadURL');
		
		$objectVariable = array();
		
		$objectVariable['siteURL'] = site_url();
		$objectVariable['assetsURL'] = assets_url();
		$objectVariable['baseURL'] = base_url();
		$objectVariable['uploadURL'] = base_url() . $this->config->item('uploadURL');
		
		$data['mantrackrObj'] = json_encode($objectVariable);
		
		
		$data['pendingPhotosNum'] = $this->member->getPendingPhotosCount();
		$data['flaggedMembersNum'] = $this->member->getFlaggedMembersCount();
		
		$messages = $this->readFlashMessages();
		
		$data['messages'] = $messages;
		
		return $data;
	}
	private function checkLogin(){
		
		if (!$this->isUserLoggedIn()) $this->redirectToLoginPage();
		
	}
	private function isUserLoggedIn(){
		
		if ($this->member->getId()) return true;
		return false; 
	}
	
	private function redirectToLoginPage(){
		$this->redirectPage('/admin/login');
	}
	
	private function redirectToHomePage(){
		$this->redirectPage('/admin');
	}
	
	private function redirectPage($path){	
		
		$redirect_url = site_url($path);

		redirect($redirect_url);
	}
	
	private function addFlashMessage($type, $msg, $emphasis = ''){
		
		$messages = $this->session->flashdata('flash_messages');

		if (!$messages || !is_array($messages))
			$messages = array();
		
		$messages[] = array('msg_type'=>$type, 'msg_content'=>$msg, 'head' => $emphasis);

		$this->session->set_flashdata('flash_messages', $messages);
	}
	
	private function readFlashMessages(){
		
		$messages = $this->session->flashdata('flash_messages');
		
		if (!$messages || !is_array($messages))
			$messages = array();
		
		return $messages;
	}
}  