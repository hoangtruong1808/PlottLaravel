<?php
namespace App\Library\LDAP;

use Barryvdh\Debugbar\Facades\Debugbar;
use Exception;

/**
 * Class PloService_LdapLoginCustom
 */
class Ldap
{
    /** @var  string */
    private $id;
    /** @var  string */
    private $password;
    /** @var  mixed */
    private $error_ldap_code;
    /** @var  string */
    private $ldap_type;
    /** @var  mixed */
    private $upn_suffix;
    /** @var  string */
    private $lang_code;
    /** @var  mixed */
    private $language;
    /** @var  mixed */
    protected $search;
    /** @var  mixed */
    protected $name_attributes;
    /** @var  mixed */
    protected $kana_attributes;
    /** @var  mixed */
    protected $mail_attributes;
    /** @var  mixed */
    protected $host_name;
    /** @var  mixed */
    protected $port;
    /** @var  mixed */
    protected $rdn;
    /** @var  mixed */
    protected $base_dn;
    /** @var  mixed */
    protected $ldap_id;
    /** @var  mixed */
    protected $filter;
    /** @var  mixed */
    protected $entry;
    /** @var  mixed */
    protected $entry_group_user;
    /** @var  mixed */
    protected $link;
    /** @var  mixed */
    protected $protocol_version;

    const ACTIVE_DIRECTORY = "AD";
    const OPEN_LDAP = "OL";
    const LANGUAGE_DEFAULT = "ja";

    public function __construct(array $data_user, $type_ldap, $lang_id = null)
    {
        // Get configure in file json
        $languages     = file_get_contents(__DIR__ . '/Configure/language.json');
        $ldap_contents = file_get_contents(__DIR__ . '/Configure/ldap_conf.json');
        // Information user login
        $this->id        = !empty($data_user["login_code"]) ? $data_user["login_code"] : "";
        $this->password  = !empty($data_user["password"]) ? $data_user["password"] : "";
        $this->ldap_type = !empty($type_ldap) && in_array(strtoupper($type_ldap), [
            self::ACTIVE_DIRECTORY,
            self::OPEN_LDAP,
        ]) ? strtoupper($type_ldap) : self::ACTIVE_DIRECTORY;
        $this->lang_code = !empty($lang_id) ? $this->getLanguageCode($lang_id) : self::LANGUAGE_DEFAULT;
        $config          = json_decode($ldap_contents, true)[$type_ldap];
        $this->language  = json_decode($languages, true);
        // Information configure ldap
        $this->setConfigLdap($config);
    }

    /**
     * @param array $search
     *
     * @return void
     */
    public function setLdapSearch(array $search)
    {
        $this->search = count($search) ? $search : [];
    }

    /**
     * @param $lang_id
     *
     * @return string
     */
    private function getLanguageCode($lang_id)
    {
        switch($lang_id) {
            case "01":
                $lang = "jp";
                break;
            case "02":
                $lang = "en";
                break;
            case "03":
                $lang = "zh";
                break;
            case "04":
                $lang = "ko";
                break;
            case "05":
                $lang = "vi";
                break;
            default:
                $lang = "jp";
        }
        return $lang;
    }

    /**
     * Connection with LDAP
     *
     * @throws \Exception
     */
    public function connectLdap()
    {

        $result = [
            "status"  => true,
            "message" => $this->language[$this->lang_code]["I_SUCCESS"]
        ];
        if(empty($this->host_name) || empty($this->port))
            return false;
        try {
            $search           = array_merge($this->name_attributes, $this->kana_attributes, $this->mail_attributes);
            $host_name_array  = explode("\n", $this->host_name);
            $upn_suffix_array = explode("\n", $this->upn_suffix);
            putenv("LDAPTLS_REQCERT=never");
            foreach($host_name_array as $host_name) {
                $resource_ldap = ldap_connect($host_name, $this->port);
                if($resource_ldap) {
                    ldap_set_option($resource_ldap, LDAP_OPT_PROTOCOL_VERSION, $this->protocol_version);
                    ldap_set_option($resource_ldap, LDAP_OPT_REFERRALS, 0);
                    $this->link = $resource_ldap;
                    $this->ldapConnectMethod($this->ldap_type, $upn_suffix_array);
                    $this->base_dn = explode('/', $this->base_dn);
                }

            }
            $get_info_ldaps = $this->ldapUserInfo($this->id, $upn_suffix_array, $search);
            $this->entry    = $this->formatUserLdap($get_info_ldaps);
            $this->convertDataEntry();
            if(count($this->entry) == 0) {
                throw new Exception($this->language[$this->lang_code]["E_COMMON_02"]);
            }
        } catch(Exception $e) {
            Debugbar::error($e->getMessage());
            $result["status"]  = false;
            $result["message"] = $this->language[$this->lang_code]["E_COMMON_02"];
        }
        return $result;
    }

    /**
     * @return void
     */
    private function convertDataEntry()
    {
        $entry            = [];
        $entry_group_user = [];
        $key_new_entry    = [
            "givenname"      => "first_name",
            "sn"             => "last_name",
            "displayname"    => "full_name",
            "samaccountname" => "login_code",
            "mail"           => "mail"
        ];
        foreach($key_new_entry as $key => $new_entry) {
            if(!empty($this->entry[$key])) {
                $entry[$new_entry] = $this->entry[$key];
            }
        }
        if(count($this->entry_group_user) > 0) {
            unset($this->entry_group_user["count"]);
            foreach($this->entry_group_user as $key_entry_group_user => $value_entry_group_user) {
                foreach($key_new_entry as $key => $new_entry) {
                    if(!empty($value_entry_group_user[$key])) {
                        $entry_group_user[$key_entry_group_user][$new_entry] = $value_entry_group_user[$key][0];
                    }
                }
            }
        }
        $this->entry            = $entry;
        $this->entry_group_user = $entry_group_user;
    }

    /**
     * Set information ldap
     *
     * @return void
     */
    public function setConfigLdap($config)
    {
        $key_info_ldap = [
            "host_name",
            "port",
            "protocol_version",
            "base_dn",
            "upn_suffix",
            "rdn",
            "filter",
            "name_attributes",
            "kana_attributes",
            "mail_attributes",
            "logincode_type",
            "search",
        ];
        foreach($key_info_ldap as $val_info_ldap) {
            if($val_info_ldap == "name_attributes") {
                $this->$val_info_ldap = $this->getSeparatedAttributes($config["get_name_attribute"], "cn");
            } elseif($val_info_ldap == "kana_attributes") {
                $this->$val_info_ldap = $this->getSeparatedAttributes($config["get_mail_attribute"], "mail");
            } elseif($val_info_ldap == "mail_attributes") {
                $this->$val_info_ldap = $this->getSeparatedAttributes($config["get_mail_attribute"], "sAMAccountName");
            } elseif($val_info_ldap == "search") {
                $this->setLdapSearch($config[$val_info_ldap]);
            } else {
                $this->$val_info_ldap = !empty($config[$val_info_ldap]) ? $config[$val_info_ldap] : "";
            }
        }
    }

    /**
     * Get information ldap
     *
     * @return array
     */
    public function getInfoLdap()
    {
        $result        = [];
        $key_info_ldap = [
            "host_name",
            "port",
            "ldap_type",
            "base_dn",
            "upn_suffix",
            "rdn",
            "filter",
            "entry",
            "entry_group_user",
        ];
        foreach($key_info_ldap as $val_info_ldap) {
            $result[$val_info_ldap] = $this->$val_info_ldap;
        }
        return $result;
    }

    /**
     * Ldap Connection method
     *
     * @param $type
     * @param $upn_suffix_array
     *
     * @throws \Exception
     */
    private function ldapConnectMethod($type, $upn_suffix_array)
    {
        try {
            switch($type) {
                case self::ACTIVE_DIRECTORY:
                    foreach($upn_suffix_array as $upn_suffix) {

                        $this->upn_suffix = $upn_suffix;
                        $this->bind($this->getRdn($this->id), $this->password);
                    }
                    break;
                case self::OPEN_LDAP:
                    $list_dn = explode('/', $this->base_dn);
                    foreach($list_dn as $dn) {
                        $this->bind($this->getRdn($this->id, $dn), $this->password);
                    }
                    break;
                default:
                    throw new Exception($this->language[$this->lang_code]["E_COMMON_TYPE_LDAP"] . $this->ldap_type);
            }

        } catch(Exception $e) {
            var_dump($e->getMessage());
            if(empty($this->error_ldap_code)) {
                throw new Exception($e->getMessage());
            } elseif($this->error_ldap_code == -1) {
                throw new Exception($this->language[$this->lang_code]["E_COMMON_01"]);
            } else {
                throw new Exception($this->language[$this->lang_code]["E_COMMON_22"]);
            }
        }
    }

    /**
     * Get Information User Ldap
     *
     * @param       $id
     * @param       $upn_suffix_array
     * @param array $search
     *
     * @return array|mixed
     * @throws \Exception
     */
    private function ldapUserInfo($id, $upn_suffix_array, $search = [])
    {
        foreach($this->base_dn as $base_dn) {
            switch($this->ldap_type) {
                case self::ACTIVE_DIRECTORY:
                    $search = array_unique(array_merge($this->search, $search));
                    for($j = 0; $j < count($upn_suffix_array); $j++) {
                        $this->upn_suffix = $upn_suffix_array[$j];
                        list($filter, $filter_sub, $filter_group_user) = $this->getFilter($id, $this->ldap_type);
                        $result            = ldap_search($this->link, $base_dn, $filter, $search);
                        $result_sub        = ldap_search($this->link, $base_dn, $filter_sub, $search);
                        $result_group_user = ldap_search($this->link, $base_dn, $filter_group_user, $search);
                        if($result_group_user != false) {
                            $this->entry_group_user = ldap_get_entries($this->link, $result_group_user);
                        }
                        if(ldap_errno($this->link) === 0 && ($result != false || $result_sub != false)) {
                            $entries     = ldap_get_entries($this->link, $result);
                            $entries_sub = ldap_get_entries($this->link, $result_sub);
                            if($entries['count'] > 0) {
                                return $entries[0];
                            }
                            if($entries_sub['count'] > 0) {
                                return $entries_sub[0];
                            }
                        }
                    }
                    if(count($this->base_dn) == 0) {
                        throw new Exception($this->language[$this->lang_code]["E_COMMON_02"]);
                    }
                    break;
                case self::OPEN_LDAP:
                    $search[] = $this->rdn;
                    list($filter) = $this->getFilter($id, $this->ldap_type);
                    $result = ldap_search($this->link, $base_dn, $filter, $search);
                    if(ldap_errno($this->link) == 0 || $result !== false) {
                        $entries = ldap_get_entries($this->link, $result);
                        if($entries['count'] > 0) {
                            for($val = 0; $val < $entries['count']; $val++) {
                                if(isset($entries[$val][$this->rdn][0])) {
                                    return $entries[$val];
                                }
                            }
                        }
                    }
                    if(count($this->base_dn) == 0) {
                        throw new Exception($this->language[$this->lang_code]["E_COMMON_02"]);
                    }
                    break;
                default:
                    throw new Exception($this->language[$this->lang_code]["E_COMMON_TYPE_LDAP"] . $this->ldap_type);
            }
        }
        return [];
    }

    /**
     * @param $id
     * @param $baseDn
     *
     * @return string
     * @throws \Exception
     */
    private function getRdn($id, $baseDn = null)
    {
        switch($this->ldap_type) {
            case self::ACTIVE_DIRECTORY:
                return $id . '@' . $this->upn_suffix;
            case self::OPEN_LDAP:
                return $this->rdn . '=' . $id . ',' . $baseDn;
            default:
                throw new Exception($this->language[$this->lang_code]["E_COMMON_TYPE_LDAP"] . $this->ldap_type);
        }
    }

    /**
     * Bind ldap: Check connection
     *
     * @param null $rdn
     * @param null $password
     *
     * @throws Exception
     */
    private function bind($rdn = null, $password = null)
    {
//        var_dump($rdn);
//        exit();
        if(!is_resource($this->link)) {
            throw new Exception(__FUNCTION__ . 'に失敗しました。 リンクIDが不正です\n' . print_r($this->link, true));
        }
        if(!@ldap_bind($this->link, $rdn, $password)) {
            $this->error_ldap_code = ldap_errno($this->link);
            throw new Exception($this->language[$this->lang_code]["E_COMMON_01"]);
        }
    }

    /**
     * @param      $attributes
     * @param null $default
     *
     * @return array|false|string[]
     */
    private function getSeparatedAttributes($attributes, $default = null)
    {
        return $attributes ? explode('/', $attributes) : (array)$default;
    }

    /**
     * @param $id
     * @param $ldap_type
     *
     * @return array
     * @throws Exception
     */
    private function getFilter($id, $ldap_type)
    {
        $base_sub           = null;
        $base_entry_mutiple = "cn=*";
        switch($ldap_type) {
            case self::ACTIVE_DIRECTORY:
                $base     = $this->filter ? '(&(userPrincipalName=' . $id . '@' . $this->upn_suffix . ')(' . $this->filter . '))' : '(userPrincipalName=' . $id . '@' . $this->upn_suffix . ')';
                $base_sub = $this->filter ? '(&(sAMAccountName=' . $id . ')(' . $this->filter . '))' : '(sAMAccountName=' . $id . ')';
                break;
            case self::OPEN_LDAP:
                $base = $this->filter ? '(&(' . $this->rdn . '=' . $id . ')(' . $this->filter . '))' : '(' . $this->rdn . '=' . $id . ')';
                break;
            default:
                throw new Exception($this->language[$this->lang_code]["E_COMMON_TYPE_LDAP"] . $this->ldap_type);
        }
        return array($base, $base_sub, $base_entry_mutiple);
    }

    /**
     * Format User Ldap
     *
     * @param array $raw
     *
     * @return array
     */
    private function formatUserLdap(array $raw)
    {
        $user = [];
        if(count($raw) > 0) {
            foreach($raw as $key => $value) {
                if($key === 'dn') {
                    $user[$key] = $value;
                    continue;
                }
                if(!is_array($value)) {
                    continue;
                }
                $user[$key] = $value[0];
            }
        }
        return $user;
    }
}

