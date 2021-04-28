<style>
    #mp_employee_list {
        position: relative;
    }
    .mp_header {
        position: fixed;
        top: 55px;
        display: none;
        background: #fff;
        width: 80%;
    }
    .mp_header th {
        text-align: left;
    }
    #mp_employee_list table{
        width: 100%;
    }
    #mp_employee_list td, #mp_employee_list th {
        width: 30%;
    }   
    #mp_employee_list td:nth-child(2), #mp_employee_list th:nth-child(2) {
        width: 15%;
    }
    #mp_employee_list td:nth-child(3), #mp_employee_list th:nth-child(3) {
        width: 25%;
    }
    #mp_employee_list td:nth-child(4), #mp_employee_list th:nth-child(4) {
        width: 30%;
    }
</style><div id="mp_peronal_dlg" class="modal modal-xl fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document" style="width: 80%;">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Personal <button type="button" class="btn btn-default" id="mp_personal_refresh">Neu laden <span></span></button> <a href="" class="btn btn-primary" id="mp_personal_export">Exportieren</a></h4>
      </div>
      <div class="modal-body" style="height: 90%; overflow: auto;">
        <div class="row">
            <div class="col-xs-3"><label for="mp_employee_qualification">Ausbildung filtern:</label></div>
            <div class="col-xs-9"><select id="mp_employee_qualification"></select></div>
        </div>
        <hr width="100%">
        <div style="height: 20px;"></div>
        <div class="row">
            <div id="mp_employee_list" class="col-xs-12 col-lg-10 col-lg-push-1 " style="height: 85%;">
                <div class="mp_header">
                    <table>
                        <thead>
                            <tr>
                                <th>Wache</th>
                                <th>Name</th>
                                <th>Ausbildung</th>
                                <th>Fahrzeug</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <table class="sortable">
                    <thead>
                        <tr>
                            <th>Wache</th>
                            <th>Name</th>
                            <th>Ausbildung</th>
                            <th>Fahrzeug</th>
                        </tr>
                    </thead>
                    <tbody id="mp_employee_list_body">
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>