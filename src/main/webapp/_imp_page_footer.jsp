<%@ page import="org.dew.webapp.util.WebUtil" contentType="text/html; charset=UTF-8" %>

<div id="wpfront-scroll-top-container" style="opacity: 0; right: 20px; bottom: 20px; display: none;">
	<i class="fa fa-chevron-circle-up fa-2x"></i>
</div>

<script type="text/javascript" src="js/jquery.min.js" id="jquery-core-js"></script>
<script>
	var $ = jQuery.noConflict();
	window.__PUBLIC_PATH__ = 'design-italia/lib/bootstrap-italia/fonts';
</script>
<script type="text/javascript" src="js/plugins/popper/popper.min.js"></script>
<script type="text/javascript" src="design-italia/lib/bootstrap-italia/js/bootstrap-italia.min.js" id="bootstrap-italia-js"></script>
<script type="text/javascript" src="js/infinite-scroll.pkgd.min.js" id="responsive-lightbox-infinite-scroll-js"></script>
<script type="text/javascript">
	function wpfront_scroll_top_init() {
		if (typeof wpfront_scroll_top === "function" && typeof jQuery !== "undefined") {
			wpfront_scroll_top({
				"scroll_offset": 100,
				"button_width": 0,
				"button_height": 0,
				"button_opacity": 0.8,
				"button_fade_duration": 200,
				"scroll_duration": 400,
				"location": 1,
				"marginX": 20,
				"marginY": 20,
				"hide_iframe": false,
				"auto_hide": false,
				"auto_hide_after": 2,
				"button_action": "top",
				"button_action_element_selector": "",
				"button_action_container_selector": "html, body",
				"button_action_element_offset": 0
			});
		} else {
			setTimeout(wpfront_scroll_top_init, 100);
		}
	}
	wpfront_scroll_top_init();
</script>
<script type="text/javascript">
	var isMobile = false; //initiate as false
	// device detection
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
		document.body.classList.add('touch')
	}
	// Toogle class mobile nav
	const elements = document.querySelectorAll('.menu-item-has-children');
	elements.forEach(function(el, index) {
		el.onclick = function() {
			el.classList.toggle('active');
		}
	})
	// Toogle class sticky header on scroll
	var scrollPosition = window.scrollY;
	var headerContainer = document.getElementsByClassName('it-header-wrapper')[0];
	window.addEventListener('scroll', function() {
		scrollPosition = window.scrollY;
		if (scrollPosition >= 130) {
			headerContainer.classList.add('is-sticky');
		} else {
			headerContainer.classList.remove('is-sticky');
		}
	});
</script>
<script type="text/javascript" src="js/wpfront-scroll-top.min.js" id="wpfront-scroll-top-js"></script>
<script type="text/javascript" id="siteorigin-panels-front-styles-js-extra">
	var panelsStyles={"fullContainer":"body","stretchRows":"1"};
</script>
<script type="text/javascript" src="js/styling.min.js" id="siteorigin-panels-front-styles-js"></script>

<script src="js/plugins/wow/wow.min.js" type="text/javascript"></script>
<script src="js/plugins/sweetalert/sweetalert.min.js" type="text/javascript"></script>
<script src="js/plugins/toastr/toastr.min.js" type="text/javascript"></script>
<script src="js/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="js/plugins/fullcalendar/moment.min.js" type="text/javascript"></script>
<script src="js/plugins/datapicker/bootstrap-datepicker.js" type="text/javascript"></script>
<script src="js/plugins/datapicker/bootstrap-datepicker.it.js" type="text/javascript"></script>
<script src="js/plugins/select2/select2.full.min.js" type="text/javascript"></script>
<script src="js/plugins/select2/i18n/it.js" type="text/javascript"></script>
<script src="js/plugins/validate/jquery.validate.min.js" type="text/javascript"></script>
<script src="js/plugins/validate/additional-methods.min.js" type="text/javascript"></script>
<script src="js/plugins/validate/messages_it.min.js" type="text/javascript"></script>

<script type="text/javascript" src="cldr/cldr.min.js"></script>
<script type="text/javascript" src="cldr/cldr/event.min.js"></script>
<script type="text/javascript" src="cldr/cldr/supplemental.min.js"></script>
<script type="text/javascript" src="cldr/cldr/unresolved.min.js"></script>

<script type="text/javascript" src="globalize/globalize.min.js"></script>
<script type="text/javascript" src="globalize/globalize/message.min.js"></script>
<script type="text/javascript" src="globalize/globalize/number.min.js"></script>
<script type="text/javascript" src="globalize/globalize/date.min.js"></script>
<script type="text/javascript" src="globalize/globalize/currency.min.js"></script>

<% WebUtil.writeScriptImport(out, "devextreme/js/jszip.min.js"); %>
<% WebUtil.writeScriptImport(out, "devextreme/js/dx.all.js"); %>
<% WebUtil.writeScriptImport(out, "devextreme/dx.messages.it.min.js"); %>

<% WebUtil.writeScriptImport(out, "js/jrpc.js"); %>
<% WebUtil.writeScriptImport(out, "js/main-it.js"); %>

