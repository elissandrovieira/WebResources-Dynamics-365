if (typeof (EmpresaY) === "undefined") EmpresaY = {};
if (typeof (EmpresaY.Conta) === "undefined") EmpresaY.Conta = {};


EmpresaY.Conta = {
    Enums: {
        nacional: 100000000,
        cpf: 748910000
    },

    OnChangeLocal: function (context) {
        const formContext = context.getFormContext();
        const localid = formContext.getAttribute("alf_local").getValue();

        if (localid == this.Enums.nacional) {

            formContext.getControl("alf_regimefiscal").setVisible(true);
            formContext.getAttribute("alf_regimefiscal").setRequiredLevel("required");

        } else {
            formContext.getControl("alf_regimefiscal").setVisible(false);
            formContext.getAttribute("alf_regimefiscal").setRequiredLevel("none");
        }
    },

    OnChangeRegime: function (context) {
        const formContext = context.getFormContext();
        const regime = formContext.getAttribute("alf_regimefiscal").getValue();

        if (regime == this.Enums.cpf) {
            formContext.getControl("alf_cpf").setVisible(true);
            formContext.getControl("alf_cnpj").setVisible(false);

            formContext.getAttribute("alf_cpf").setRequiredLevel("required");
            formContext.getAttribute("alf_cnpj").setRequiredLevel("none");
        } else {
            formContext.getControl("alf_cpf").setVisible(false);
            formContext.getControl("alf_cnpj").setVisible(true);

            formContext.getAttribute("alf_cpf").setRequiredLevel("none");
            formContext.getAttribute("alf_cnpj").setRequiredLevel("required");
        }
    },

    OnChageCpf: function (context) {
        const formContext = context.getFormContext();
        const cpf = formContext.getAttribute("alf_cpf");
        const cpfValueOf = cpf.getValue().replaceAll("." , "").replace("-" , "");
        const validCpfNumbers = /^(([0-9]{11}))$/;

        if (validCpfNumbers.test(cpfValueOf) == true) {

            const formatCpf = cpfValueOf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "\$1.\$2.\$3-\$4")

            Xrm.WebApi.online.retrieveMultipleRecords("account", `?$select=accountid,alf_cpf,name&$filter=alf_cpf eq '${formatCpf}'`).then(

                function success(result) {

                    if (result.entities.length > 0) {

                        let account = []
                        account[0] = {}
                        account[0].cpf = result.entities[0].alf_cpf
                        account[0].name = result.entities[0].name
                        account[0].entityType = "account"

                        EmpresaY.Util.Alert("Atencao!", `Ja existe uma conta com o nome "${account[0].name}" registrada no CNPJ: ${account[0].cpf}`)
                        cpf.setValue(null)
                    } else {
                        cpf.setValue(formatCpf)
                    }
                },
                function error(error) {
                    EmpresaY.Util.Alert("Erro!", "Erro ao procurar CPF.")
                }

            )

        } else if (validCpfNumbers.test(cpfValueOf) == false) {

            EmpresaY.Util.Alert("CPF invalido!", "Insira um CPF valido.")
            cpf.setValue(null)

        }

    },

    OnChageCnpj: function (context) {
        const formContext = context.getFormContext();
        const cnpj = formContext.getAttribute("alf_cnpj");
        const cnpjValueOf = cnpj.getValue().replaceAll(".","").replace("/","").replace("-","");
        const validCnpjNumbers = /^(([0-9]{14}))$/;

        if (validCnpjNumbers.test(cnpjValueOf) == true) {

            const formatCnpj = cnpjValueOf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "\$1.\$2.\$3/\$4-\$5")

            Xrm.WebApi.online.retrieveMultipleRecords("account", `?$select=accountid,alf_cnpj,name&$filter=alf_cnpj eq '${formatCnpj}'`).then(

                function success(result) {

                    if (result.entities.length > 0) {

                        let account = []
                        account[0] = {}
                        account[0].cnpj = result.entities[0].alf_cnpj
                        account[0].name = result.entities[0].name
                        account[0].entityType = "account"

                        EmpresaY.Util.Alert("Atencao!", `Ja existe uma conta com o nome "${account[0].name}" registrada no CNPJ: ${account[0].cnpj}`)
                        cnpj.setValue(null)
                    } else {
                        cnpj.setValue(formatCnpj)
                    }
                },
                function error(error) {
                    EmpresaY.Util.Alert("Erro!", "Erro ao procurar CNPJ.")
                }
            )

        } else if (validCnpjNumbers.test(cnpjValueOf) == false) {

            EmpresaY.Util.Alert("CNPJ invalido!", "Insira um CNPJ valido.")
            cnpj.setValue(null)

        }

    },

    OnLoad: function (context) {
        const formContext = context.getFormContext();
        const localid = formContext.getAttribute("alf_local").getValue();
        const regime = formContext.getAttribute("alf_regimefiscal").getValue();

        if (localid == this.Enums.nacional) {
            formContext.getControl("alf_regimefiscal").setVisible(true);

            if (regime == this.Enums.cpf) {
                formContext.getControl("alf_cpf").setVisible(true);
                formContext.getControl("alf_cnpj").setVisible(false);
            } else {
                formContext.getControl("alf_cpf").setVisible(false);
                formContext.getControl("alf_cnpj").setVisible(true);
            }

        } else {
            formContext.getControl("alf_regimefiscal").setVisible(false);
            formContext.getControl("alf_cpf").setVisible(false);
            formContext.getControl("alf_cnpj").setVisible(false);
        }

        

        const defaultId = "80ac35a0-01af-ea11-a812-000d3a8b3ec6"


        Xrm.WebApi.online.retrieveMultipleRecords("contact", "?$select=contactid,fullname&$filter=contactid eq " + defaultId).then(

            function success(result) {

                if (result.entities.length > 0) {

                    const formContext = context.getFormContext()

                    let contact = []
                    contact[0] = {}
                    contact[0].id = result.entities[0].contactid
                    contact[0].name = result.entities[0].fullname
                    contact[0].entityType = "contact"

                    formContext.getAttribute("primarycontactid").setValue(contact)

                }
            },
            function error(error) {
                EmpresaY.Util.Alert("Erro!", "Erro ao buscar o contato padrão da empresa.")
            }
        )

    }
};