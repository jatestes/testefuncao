
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var beneficiarios = [];

        $('#gridBeneficiarios tr').has('input').each(function () {
            var benef = {};
            var cpf = "";
            var nome = "";

            $('input', $(this)).each(function (index, item) {
                if (index == 0) {
                    cpf = $(item).val();

                } else if (index == 1) {
                    nome = $(item).val();
                }                
            });
            
            benef = { "CPF": cpf, "Nome": nome, "State": "New" };

            beneficiarios.push(benef);
        });

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CPF": $(this).find("#CPF").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Beneficiarios": beneficiarios
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    });

    $('#incluirBeneficiario').on('click', function () {
        var cpfBenefic = $('#CPFBeneficiario').val();
        var nomeBenefic = $('#NomeBeneficiario').val();

        if (!cpfBenefic || !nomeBenefic) {
            alert('Um beneficiário deve ter um CPF e um nome.');
        }
        else if (!validarCPF(cpfBenefic)) {
            alert('CPF inválido');
        }
        else {
            //var existeCpf = $('table:contains(' + cpfBenefic + ')').length;
            var existeCpf = $('table').find("input[value='" + cpfBenefic + "']").length;

            if (existeCpf) {
                alert('Já existe beneficiário com CPF ' + cpfBenefic + ' para este cliente.');
            }
            else {
                var cpfToId = cpfBenefic.replaceAll('.', '_');
                var idCpf = 'cpf' + cpfToId;
                var idNome = 'nome' + cpfToId;
                var campoCpf = '<input class="form-control" type="text" value="' + cpfBenefic + '" id="' + idCpf + '" readonly onblur="blurCpfBeneficiario(\'' + cpfToId + '\')">';
                var campoNome = '<input class="form-control" type="text" value="' + nomeBenefic + '" id="' + idNome + '" readonly onblur="blurNomeBeneficiario(\'' + cpfToId + '\')">';
                var idLinha = 'linha' + cpfToId;

                var novaLinha = '<tr id="' + idLinha + '"><td>' + campoCpf + '</td><td>' + campoNome  + '</td>'                  
                    + '<td><button type="button" id="alterar' + cpfToId + '" class="btn btn-success" onclick="alterarBeneficiario(\'' + cpfToId + '\')">Alterar</button></td>'
                    + '<td><button type="button" id="excluir' + cpfToId + '" class="btn btn-success" onclick="excluirBeneficiario(\'' + idLinha + '\')">Excluir</button></td>'
                    + '</tr>';
                    
                $('#tbodyBenefic').append(novaLinha);
                $('#CPFBeneficiario').val('');
                $('#NomeBeneficiario').val('');
            }            
        }
    });
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos	
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito	
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito	
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function excluirBeneficiario(idLinha) {
    var id = '#' + idLinha;
    var state = $(id).data('state');

    $(id).remove();
}

function alterarBeneficiario(id) {
    var $cpf = $('#cpf' + id);
    var $nome = $('#nome' + id);
    var $botaoAlt = $('#alterar' + id);
    var $botaoExc = $('#excluir' + id);
    var valCpf = $cpf.val();
    var valNome = $nome.val();

    if ($botaoAlt.html() == 'Alterar') {
        localStorage.setItem("cpfBenefic", valCpf);
        localStorage.setItem("nomeBenefic", valNome);

        $cpf.prop('readonly', false);
        $nome.prop('readonly', false);
        $botaoAlt.html('Salvar');
        $botaoExc.hide();
        $cpf.focus();
    } else {
        // Ao salvar alterações        

        if (!valCpf || !valNome) {
            alert('Um beneficiário deve ter um CPF e um nome.');
            resetCamposBenefic();
        } else if (!validarCPF(valCpf)) {
            alert('CPF inválido.');
            resetCamposBenefic();
        } else {
            var existeCpf = $('table').find("input[value='" + valCpf + "']").length;

            if (existeCpf > 1) {
                alert('Já existe beneficiário com CPF ' + valCpf + ' para este cliente.');
                resetCamposBenefic();
            } else {
                // Salva alteração
                $cpf.prop('readonly', true);
                $nome.prop('readonly', true);
                $botaoAlt.html('Alterar');
                $botaoExc.show();
            }       
       }  
    }    
}

function blurCpfBeneficiario(id) {
    var valCpfAnt = localStorage.getItem("cpfBenefic");
    var $cpf = $('#cpf' + id);
    var valCpf = $cpf.val();

    if (!valCpf) {
        alert('Um beneficiário deve ter um CPF.');
        $cpf.val(valCpfAnt);
    } else if (!validarCPF(valCpf)) {
        alert('CPF inválido.');
        $cpf.val(valCpfAnt);
    } else {
        var existeCpf = $('table').find("input[value='" + valCpf + "']").length;

        if (existeCpf > 1) {
            alert('Já existe beneficiário com CPF ' + valCpf + ' para este cliente.');
            $cpf.val(valCpfAnt);
        } else {
            localStorage.setItem("cpfBenefic", valCpf);            
        }
    }
}

function blurNomeBeneficiario(id) {
    var $nome = $('#nome' + id);
    var valNome = $nome.val();

    if (!valNome) {
        alert("Um nome deve ser fornecido para o beneficiário.");

        var valNomeAnt = localStorage.getItem("nomeBenefic");
        $nome.val(valNomeAnt);
    }
    else {
        localStorage.setItem("nomeBenefic", valNome);        
    }
}

function resetCamposBenefic() {
    var $cpf = $('#cpf' + id);
    var valCpfAnt = localStorage.getItem("cpfBenefic");

    $cpf.val(valCpfAnt);

    var $nome = $('#nome' + id);
    var valNomeAnt = localStorage.getItem("nomeBenefic");;

    $nome.val(valNomeAnt);
}



