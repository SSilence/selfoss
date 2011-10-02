<?PHP

namespace helpers;

/**
 * Helper class for rendering template
 *
 * @package    application_controllers
 * @subpackage helpers
 * @copyright  Copyright (c) Tobias Zeising (http://www.aditu.de)
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 */
class View {

    /**
     * set global view vars
     */
    function __construct() {
		if(strlen(trim(\F3::get('base_url')))>0) {
			$this->base = \F3::get('base_url');
			return;
		}
		
        $lastSlash = strrpos($_SERVER['SCRIPT_NAME'], '/');
        $subdir = $lastSlash!==false ? substr($_SERVER['SCRIPT_NAME'], 0, $lastSlash) : '';
        $this->base = 'http' . 
                      (isset($_SERVER["HTTPS"])=="on" ? 's' : '') . 
                      '://' . $_SERVER["SERVER_NAME"] . 
                      ($_SERVER["SERVER_PORT"]!="80" ? ':'.$_SERVER["SERVER_PORT"] . '' : '') . 
                      $subdir . 
                      '/';
    }

    
    /**
     * render template
     *
     * @return string rendered html
     * @param string $template file
     */
    public function render($template) {
        ob_start();
        include $template;
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    }
    
    
    /**
     * send error message
     *
     * @return void
     * @param string $message
     */
    public function error($message) {
        header("HTTP/1.0 400 Bad Request");
        die($message);
    }
    
    
    /**
     * send error message as json string
     *
     * @return void
     * @param mixed $datan
     */
    public function jsonError($data) {
        $this->error( json_encode($data) );
    }
    
    
    /**
     * send success message as json string
     *
     * @return void
     * @param mixed $datan
     */
    public function jsonSuccess($data) {
        die(json_encode($data));
    }
}
