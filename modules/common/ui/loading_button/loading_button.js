/**
 * @require style.css
 */

module.exports = function (button) {
	this.source = button;
	this.button = button.clone();
	this.text 	= button.text();
	this.tmpl 	= "<span class='btn_loading'>{0}</span>".format(this.text);

	this.init = function () {
		this.button.attr("id", "loading-button");

		this.source.hide().before(this.button);
		this.button.addClass('btn-gray').html(this.tmpl);
	};

	this.close = function () {
		this.source.show();
		this.button.removeClass('btn-gray').hide();
	};

	this.check = function () {
		return this.button.hasClass('btn-gray');
	};

	this.init();

	return this;
};