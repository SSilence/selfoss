<?php

namespace spouts\twitter;

use Abraham\TwitterOAuth\TwitterOAuth;

/**
 * Spout for fetching a twitter list
 *
 * @package    spouts
 * @subpackage twitter
 * @copyright  Copyright (c) Nicola Malizia (https://unnikked.ga/)
 * @license    GPLv3 (https://www.gnu.org/licenses/gpl-3.0.html)
 * @author     Nicola Malizia <unnikked@gmail.com>
 */

class listtimeline extends \spouts\twitter\usertimeline {


    public function __construct() {
    
        $this->name = 'Twitter - List timeline';
        $this->description = 'The timeline of a given list';
        $this->params = array(
            "consumer_key" => array(
                "title"      => "Consumer Key",
                "type"       => "text",
                "default"    => "",
                "required"   => true,
                "validation" => array("notempty")
            ),
            "consumer_secret" => array(
                "title"      => "Consumer Secret",
                "type"       => "password",
                "default"    => "",
                "required"   => true,
                "validation" => array("notempty")
            ),
            "access_token" => array(
                "title"      => "Access Token (optional)",
                "type"       => "text",
                "default"    => "",
                "required"   => false,
                "validation" => array()
            ),
            "access_token_secret" => array(
                "title"      => "Access Token Secret (optional)",
                "type"       => "password",
                "default"    => "",
                "required"   => false,
                "validation" => array()
            ),
            "slug" => array(
                "title"      => "List Slug",
                "type"       => "text",
                "default"    => "",
                "required"   => true,
                "validation" => array("notempty")
            ),
            "owner_screen_name" => array(
                "title"      => "Username",
                "type"       => "text",
                "default"    => "",
                "required"   => true,
                "validation" => array("notempty")
            )
        );
    }

    /**
     * loads content for given list
     *
     * @return void
     * @param mixed $params the params of this source
     */
    public function load($params) {
        $access_token_used = !empty($params['access_token']) && !empty($params['access_token_secret']);
        $twitter = new TwitterOAuth($params['consumer_key'], $params['consumer_secret'], $access_token_used ? $params['access_token'] : null, $access_token_used ? $params['access_token_secret'] : null);
        $timeline = $twitter->get('lists/statuses',
            array(
                'slug' => $params['slug'],
                'owner_screen_name' => $params['owner_screen_name'],
                'include_rts' => 1,
                'count' => 50
            ));

        if (isset($timeline->errors)) {
            $errors = '';

            foreach ($timeline->errors as $error) {
                $errors .= $error->message . "\n";
            }

            throw new \Exception($errors);
        }

        if(!is_array($timeline))
            throw new \Exception('invalid twitter response');
        
        $this->items = $timeline;
        
        $this->htmlUrl = 'https://twitter.com/' . urlencode($params['owner_screen_name']);

        $this->spoutTitle = "@{$params['owner_screen_name']}/{$params['slug']}";
    }

}
