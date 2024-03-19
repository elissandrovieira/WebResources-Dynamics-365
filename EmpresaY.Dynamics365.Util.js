if (typeof (EmpresaY) === "undefined") EmpresaY = {}
if (typeof (EmpresaY.Util) === "undefined") EmpresaY.Util = {}

EmpresaY.Util = {

    Alert: function (title, description) {

        const textSettings = {
            confirmButtonLabel: "OK",
            title: title,
            text: description
        }

        const optionsSettings = {
            height: 120,
            width: 200
        }

        Xrm.Navigation.openAlertDialog(textSettings, optionsSettings)
    }
}