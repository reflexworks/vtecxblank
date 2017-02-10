/**
 * 認証用トークン作成サービス
 */
var _count_str = 0;
(function($) {
  $.createToken = function(username, password) {
    var getWsseObj = function(Password, Token) {
        var PasswordDigest, Nonce, Created, shaObj, nonceEncoded;
        var r = new Array;
        var datatime = isodatetime();

        _count_str++;

        if (!Token) Token = '';
        Nonce = b64_sha1(datatime + 'There is more than words' + _count_str);
        nonceEncoded = encode64(Nonce);
        Created = datatime;

        shaObj = new jsSHA(Token + Nonce + Created + Password, "ASCII");
        PasswordDigest = shaObj.getHash("SHA-256", "B64");

        r[0] = nonceEncoded;
        r[1] = Created;
        r[2] = PasswordDigest;
        return r;
    };

    // WSSEオブジェクト作成：固定値のAPIキーなし
    var getWsse = function(username, password){
        var w = getWsseObj(password, null);
          return 'UsernameToken Username="' + username + '", PasswordDigest="' + w[2] + '", Created="' + w[1] + '", Nonce="' + w[0] + '"';
    };
      return getWsse(username, password);
  };
})(jQuery);
