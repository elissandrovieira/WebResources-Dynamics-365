if (typeof (EmpresaY) === "undefined") EmpresaY = {};
if (typeof (EmpresaY.Contato) === "undefined") EmpresaY.Contato = {};


EmpresaY.Contato = {

    OnLoad: function (context) {

        let formContext = context.getFormContext();
        let id = formContext.data.entity.getId();

        Xrm.WebApi.online.retrieveMultipleRecords("opportunity", `?$select=opportunityid,totalamount&$filter=_parentcontactid_value eq ${id}`).then(
            function success(result) {

                console.log(result)

                let amount = 0;
                let totalAmount = 0;

                for (let i = 0; i < result.entities.length; i++) {
                    amount = amount + 1;
                    totalAmount = totalAmount + result.entities[i].totalamount;
                }

                formContext.getAttribute("alf_total_oportunidades").setValue(amount);
                formContext.getAttribute("alf_valor_oportunidades").setValue(totalAmount);
            },
        )
    }
}