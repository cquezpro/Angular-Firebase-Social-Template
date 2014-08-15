<?php

	class BaseController extends CI_Controller
	{
		
		public function __construct(){
			parent::__construct();
			$this->load->helper('service_errorcodes');
			$this->load->helper('utilities');
			$this->load->model('Serviceresult_model', 'sresult');
			
		}
		
		public function sendJsonOutput(){
			
			$output = $this->sresult;
			
			if (get_class($output) != 'Serviceresult_model'){
				die('Error! Unkown output object type.');
				exit();
			}
			
			/*header("Access-Control-Allow-Origin: *");
			header("Content-Type: application/json");
			echo json_encode($output->getData());*/
			$this->output
				->set_header('Access-Control-Allow-Origin: *')
				->set_header('Access-Control-Allow-Headers: *')
				->set_content_type('application/json')
				->set_output(json_encode($output->getData()));
		}
		
		protected function getInputValue($name){
			$value = $this->input->get($name);
			
			if ($value == '') $value = $this->input->post($name);
			
			return $value;
		}
		
	}