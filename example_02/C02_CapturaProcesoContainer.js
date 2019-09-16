import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import * as at from '../../store/actions/index';
import * as CONSTANTES from '../../shared/constantes';

import Moment from 'react-moment';

import Button from '../../components/general/ButtonComponent'
import Card from 'react-bootstrap/Card';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Alerta from '../../components/general/AlertComponent';
import Captura from '../../components/Ordenia/CapturaAnimalComponent'
import Encabezado from '../../components/Ordenia/EncabezadoCargaComponent';
import ListaCaptura from '../../components/Ordenia/ListaCapturaComponent';
import ListaCapturaProgreso from '../../components/Ordenia/ListaCapturaProgresoComponent';
import ListaSecado from '../../components/Ordenia/ListaSecadoComponent';
import Loader from '../../components/general/LoaderComponent';
import CommonRow from '../../components/general/SimpleRowComponent';

import SinPesada from '../../components/Ordenia/SinPesadaComponent';

import UploadCaptura from '../../components/Ordenia/UploadCapturaComponent';


class C02_CapturaProcesoContainer extends Component {

  tbClave = React.createRef();
  tbOrdenia1 = React.createRef();
  tbOrdenia2 = React.createRef();

  sendFocusToOrdenia1 = () => {
    this.tbOrdenia1.current.focus();
  }
  sendFocusToOrdenia2 = () => {
    this.tbOrdenia2.current.focus();
  }

  sendFocusToClave = () => {
    this.tbClave.current.focus();
  }

  handleFocusToClave = () => {
    this.sendFocusToClave();
  }

  handleFocusToOrdenia1 = (event) => {
    if (event.key == 'Enter') {
      this.sendFocusToOrdenia1();
    }
  }
  handleFocusToOrdenia2 = (event) => {
    if (event.key == 'Enter') {
      this.sendFocusToOrdenia2();
    }
  }

  state = {
    cancelar: false,
    encabezado: CONSTANTES.MSG_GENERANDO_LISTADO,

    ordeniaId: null,
    fechaCaptura: null,
    mostrarError: false,

    tipoRegistro: 1,

    claveBuscar: '',
    ord1: '',
    ord2: '',
    registroSeleccionado: null,

    lote: null,

    isUbicacionDefault: 0,
    editandoUbicacion: false,
    ubicacionDestinoSeleccionada: null,

    motivoSecadoSeleccionado: '',

    grupoSeleccionado: '',

    data: [],
    cargandoListaCaptura: false,
    cargandoListaSecado: false,

    disableSalvarAvance: true,
    visualizarAvance: false,

    rowRemover: null,

    continuarASecado: false,

    redireccionarAOrdeniaInicial: false,

    salir: false,

    cargarCaptura: false,

  }

  componentDidMount() {

    let ordeniaCapturaId = null;
    let fechaCaptura = null;
    let loteId = null;

    const query = new URLSearchParams(this.props.location.search);

    let cont = 0;

    for (let param of query.entries()) {

      if (cont === 0) {
        loteId = param[1];
      }

      if (cont === 1) {
        fechaCaptura = param[1];
      }

      cont++;

    }

    if (loteId !== undefined && fechaCaptura !== undefined) {
      this.props.onGetProcesoCaptura(loteId, fechaCaptura, this.actualizarEncabezado, this.setDataHandler, false);
    }

  }

  setDataHandler = (tipoData, data) => {
    let listado = [...data];
    if (tipoData === 1) { // captura
      this.setState({
        data: listado
      })
    }
  }

  cancelar = () => {
    this.setState({
      cancelar: true
    });
  }

  actualizarEncabezado = (opcion) => {
    if (opcion === 1) {
      this.setState({ encabezado: CONSTANTES.MSG_GENERANDO_LISTADO });
    } else {
      if (opcion === 2) { // ubicacion
        let ubicacion = '';
        if (this.props.lote !== null && this.props.lote !== undefined) {

          ubicacion = 'Ubicación: ';
          ubicacion += this.props.lote.rancho.nombre + ', ' + this.props.lote.potrero.nombre + ', ' + this.props.lote.nombre + '.';
          this.setState({
            lote: this.props.lote,
            encabezado: ubicacion,
            fechaCaptura: this.props.fechaCaptura,
          });
        }
      }
    }

  }


  // --------------------------------------------------------------------------- FUNCIONALIDADES PARA LA CAPTURA
  cancelarRegistroSeleccionado = () => {
    this.setState({
      registroSeleccionado: null, claveBuscar: '', CardOpcionSecado: false,

      ord1: '', ord2: '',
      tipoRegistro: 1
    });
    this.props.onActualizarNumeroPaso(1);

    setTimeout(() => {
      this.sendFocusToClave();
    }, 100);
  }

  buscarAnimal = (claveBuscar) => {
    let data = [...this.state.data];
    let animalIdx = data.findIndex((a => a.clave === claveBuscar));
    if (animalIdx >= 0) {
      let registroSeleccionado = { ...data[animalIdx] }
      this.seleccionarRegistro(registroSeleccionado, true)
      return true;
    } else {
      return false;
    }
  }

  buscarAnimalOnBlurHandler = () => {
    this.buscarAnimal(this.state.claveBuscar);
  }
  buscarAnimalHandler = (e) => {
    if (e.key === 'Enter') {
      this.buscarAnimal(this.state.claveBuscar);
    }
  }

  seleccionarRegistro = (registroSeleccionado, tipoRegistro) => {
    let ord1 = '';
    let ord2 = '';
    if (registroSeleccionado !== null) {
      ord1 = registroSeleccionado.ord1;
      ord2 = registroSeleccionado.ord2;
    }
    this.setState({
      registroSeleccionado, claveBuscar: registroSeleccionado.clave,
      tipoRegistro, // CardOpcionSecado: false,
      ord1, ord2
    });
    // console.log('registroSeleccionado', registroSeleccionado);
    try {
      this.sendFocusToOrdenia1();
    } catch (ex) {

    }
  }


  // --------------------------------------------------------------------------- FUNCIONALIDADES GENERALES
  salvarAvanceSatisfactorio = () => {
    this.setState({
      disableSalvarAvance: true, cargandoListaCaptura: false, cargandoListaSecado: false
    });
  }

  salvarAvanceError = () => {
    this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO);
  }

  actualizarDatosCapturaHandler = () => {

    this.setState({ cargandoListaCaptura: true });
    let data = [...this.state.data];
    let registroSeleccionado = { ...this.state.registroSeleccionado };

    let idx = data.findIndex((a => a.id === registroSeleccionado.id));

    if (idx >= 0) {
      data[idx].seleccionado = 0;
      data[idx].completo = 1;
      data[idx].procesado = 0
      data[idx].ord1 = this.state.ord1;
      data[idx].ord2 = this.state.ord2;
      this.setState({
        registroSeleccionado: null, claveBuscar: '', CardOpcionSecado: false,
        ord1: '', ord2: '', data,
        disableSalvarAvance: false,
      });

    }
    this.setState({ cargandoListaCaptura: false });

  }

  salvarAvanceHandler = () => {

    this.setState({
      disableSalvarAvance: true, cargandoListaCaptura: true, cargandoListaSecado: true
    });

    let animalesPorSalvar = this.props.data.filter(animal => (animal.completo === 1 && animal.procesado === 0));

    let datos = [];
    for (let d of animalesPorSalvar) {
      let animal = {
        id: d.id, animalId: d.animalId, clave: d.clave, ord1: d.ord1, ord2: d.ord2,
        secarAnimal: d.secarAnimal, ordeniaCapturaId: d.ordeniaCapturaId,
        capturado: 1, completo: 1, procesado: 1
      }
      datos.push(animal);
    }
    this.props.onSalvarAvance(this.props.loteId, datos, this.salvarAvanceError, this.salvarAvanceSatisfactorio, false);
  }

  removerDeListaHandler = (row) => {

    this.setState({ cargandoListaCaptura: true, cargandoListaSecado: true, rowRemover: row });

    let animalesPorSalvar = this.props.data.filter(animal => animal.id === row.id);
    let datos = [];
    for (let d of animalesPorSalvar) {
      let animal = {
        id: d.id, animalId: d.animalId, clave: d.clave, ord1: '', ord2: '',
        capturado: 0, secarAnimal: 0, completo: 0, ordeniaCapturaId: d.ordeniaCapturaId,
        procesado: 0
      }
      datos.push(animal);
    }
    this.props.onSalvarAvance(this.props.loteId, datos, this.salvarAvanceError, this.removerDeLista, false)

  }

  verCapturaHandler = (visualizarAvance) => {
    this.setState({ visualizarAvance })
  }

  removerDeLista = () => {

    if (this.state.rowRemover !== null) {

      let data = [...this.state.data];

      let idx = data.findIndex((a => a.id === this.state.rowRemover.id));

      if (idx >= 0) {
        data[idx].secarAnimal = 0;
        data[idx].completo = 0;

        data[idx].ord1 = '';
        data[idx].ord2 = '';

        this.setState({
          registroSeleccionado: null, claveBuscar: '', CardOpcionSecado: false,
          tipoRegistro: 1,
          ord1: '', ord2: '', data,
          disableSalvarAvance: true
        });

      }
      this.setState({ data, cargandoListaCaptura: false, cargandoListaSecado: false, rowRemover: null });
    }

  }

  esAnimalPendiente = (animal) => {

    if (animal.secarAnimal === 1) {
      if (animal.motivoSecado === null) {
        return true;
      } else {
        if (animal.motivoSecado.id === null) {
          return true;
        }
      }
    }
    return false;
  }

  continuarASecado = () => {

    if (this.state.disableSalvarAvance === false) {
      this.alertaHandler(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, CONSTANTES.MSG_REGISTROS_PENDIENTES);
      return;
    }


    this.setState({
      continuarASecado: true
    });
  }

  // --------------------------------------------------------------------------- FUNCIONALIDADES PARA SECADO

  quitarCapturaSecado = (registroSeleccionado) => {

    let datos = [];

    let animalesPorSalvar = this.props.data.filter(animal => animal.id === registroSeleccionado.id);

    for (let d of animalesPorSalvar) {
      let animal = {
        id: d.id, animalId: d.animalId, clave: d.clave,
        ordeniaCapturaId: d.ordeniaCapturaId,

        ord1: '', ord2: '',
        secarAnimal: 0, capturado: 0, completo: 0, procesado: 0,

        secadoProcesado: 0,
        motivoSecado: null,
        subgrupoDestino: null,
        loteDestinoId: null

      }
      datos.push(animal);
    }

    this.props.onSalvarAvance(0, datos, this.salvarAvanceError, this.removerDeLista, true)
  }

  marcarAnimalSecadoHandler = (marcarSecado) => {

    let registroSeleccionado = { ...this.state.registroSeleccionado };

    this.setState({ cargandoListaCaptura: true, cargandoListaSecado: true, rowRemover: registroSeleccionado });

    if (!marcarSecado) {
      this.quitarCapturaSecado(registroSeleccionado);
    }

    let data = [...this.state.data];

    let idx = data.findIndex((a => a.id === registroSeleccionado.id));

    if (idx >= 0) {

      data[idx].secarAnimal = 1;
      data[idx].completo = 1;
      data[idx].procesado = 0;

      data[idx].ord1 = '';
      data[idx].ord2 = '';
      this.setState({
        registroSeleccionado: null, claveBuscar: '', CardOpcionSecado: false,
        tipoRegistro: 1,
        ord1: '', ord2: '', data,
        disableSalvarAvance: false
      });

    }

    this.setState({ data, cargandoListaCaptura: false, cargandoListaSecado: false });

  }

  // --------------------------------------------------------------------------- FUNCIONALIDADES DEL FORM
  alertaHandler = (mostrarMensaje, tipoMensaje, mensaje) => {
    this.props.onMostrarOcultarMensaje(mostrarMensaje, tipoMensaje, mensaje);
  }

  actualizarClaveHandler = (event) => {
    event.preventDefault();
    this.setState({
      claveBuscar: event.target.value
    });
  }

  setValorOrdenia = (tipo) => (event) => {

    let ord = event.target.value;

    ord = parseFloat(event.target.value);

    if (isNaN(ord)) {
      ord = '';
    }
    if (ord > 0) {
      ord = ord.toFixed(3);
    }

    if (tipo === 1) {
      this.setState({
        ord1: ord
      });
    } else {
      if (tipo === 2) {
        this.setState({
          ord2: ord
        });
      }
    }
  }

  actualizarOrd = (tipo) => (event) => {

    let ord = event.target.value;

    if (tipo === 1) {
      this.setState({
        ord1: ord
      });
    } else {
      if (tipo === 2) {
        this.setState({
          ord2: ord
        });
      }
    }

  }

  submit = (event) => {
    event.preventDefault();
  }

  redireccionarHome = () => {
    this.setState({
      redireccionarAOrdeniaInicial: true
    });
  }

  showUploadCapturaOrdenia = () => {
    this.setState((prevState, props) => ({
      cargarCaptura: !prevState.cargarCaptura
    }));
  }

  archivoProcesado = () => {
    window.location.reload();
  }

  render() {

    if (this.state.cancelar === true) {
      return <Redirect to={'/ordenia'} />
    }

    if (this.state.continuarASecado === true) {
      return <Redirect to={`/ordenia/secado/?loteId=${this.props.loteId}&fechacaptura=${this.props.fechaCaptura}`} />
    }

    if (this.state.redireccionarAOrdeniaInicial === true) {
      return <Redirect to={'/ordenia'} />
    }

    let objFechaCaptura = null;
    let objTextFecha = null;
    if (this.props.fechaCaptura !== '') {
      objFechaCaptura = <Moment format="DD/MM/YYYY">{this.props.fechaCaptura}</Moment>;
      objTextFecha = ' Fecha: ';
    }

    let vacasPendientes = 0;
    let vacasCapturadas = 0;
    let vacasSinSalvar = 0;
    let vacasMarcadas = 0;

    if (this.state.data !== null && this.state.data !== undefined) {
      let length = this.state.data.length;
      let ap = this.props.data.filter(animal => (animal.completo === 1 && animal.secarAnimal === 0));
      let as = this.props.data.filter(animal => (animal.completo === 1 && animal.secarAnimal === 1));

      let vss = this.props.data.filter(animal => (animal.completo === 1 && animal.procesado === 0));
      vacasSinSalvar = vss.length;

      vacasCapturadas = ap.length;
      vacasPendientes = length - ap.length;
      vacasMarcadas = as.length;
    }

    let alto = (
      <div style={{ height: '25vh' }}></div>
    );
    let btnAtras = (
      <div>
        {alto}
        <div>
          <Button bsStyle="info" size="large" onClick={() => this.cancelar(false)} glyph="anterior" texto="Atras" />
        </div>
      </div>
    );

    let btnSiguiente = (
      <div>
        {alto}
        <div>
          <Button bsStyle="info" size="large" onClick={() => this.continuarASecado()}
            glyph="siguiente" texto="Sig. " isTextLeft={false} />
        </div>
      </div>
    );

    let btnDone = (
      <div>
        {alto}
        <div>
          <Button bsStyle="default" size="large" glyph="folder"
            onClick={() => { this.verCapturaHandler(false) }} texto="¡Listo!" />
        </div>
      </div>
    );

    let divAlto = (<div className="row" style={{ height: '7vh' }}> </div>);

    return (


      <Aux>
        <div className="container-full">
          <Loader loading={this.props.isLoading} />
          <div>
            <Encabezado
              header="Captura de Ordeña"
              encabezado={this.state.encabezado}
              funcion={this.redireccionarHome}
              funcionUpload={this.showUploadCapturaOrdenia}
              icon="remove"
              textoBoton=" Salir"
              cargando={this.state.cargarCaptura}
            />
          </div>
          <CommonRow />
          <div >
            <Row>
              <Col xs={12}>
                <Alerta
                  alertaHandler={this.alertaHandler}
                  mensaje={this.props.mensaje}
                  tipoMensaje={parseInt(this.props.tipoMensaje)}
                  visible={this.props.mostrarMensaje}
                />
              </Col>
            </Row>

          </div>

          <div id="divUploadCaptura" style={{ height: '70vh', display: `${this.state.cargarCaptura && !this.props.isLoading ? 'block' : 'none'}` }}>

            <UploadCaptura archivoProcesado={this.archivoProcesado}
              loteId={this.props.loteId}
              fechaCaptura={this.props.fechaCaptura}
              cancelar={this.showUploadCapturaOrdenia}
            />
          </div>

          <div id="divSinPesada" style={{ height: '70vh', display: `${this.props.pesadaNoEncontrada ? 'block' : 'none'}` }}>
            {divAlto}
            <SinPesada
              textoBody='No hay datos que concuerden con esta fecha y lote.'
              funcionOk={this.redireccionarHome} />
          </div>

          <div id="divListado" style={{ height: '70vh', display: `${!this.state.cargarCaptura && !this.props.isLoading && !this.props.pesadaNoEncontrada ? 'block' : 'none'}` }}>

            <div className="row" style={{ display: `${this.state.visualizarAvance ? 'block' : 'none'}` }} >
              <div className=" col-lg-1" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>

              </div>
              <div className=" col-lg-10" >
                <div className="row">
                  <div className=" col-lg-10" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                    <ListaCapturaProgreso data={this.state.data} seleccionarRegistro={this.seleccionarRegistro}
                      cargandoLista={this.state.cargandoListaCaptura}
                      filtroCapturaSeleccionado={this.props.filtroCapturaSeleccionado}
                      confirmEnviarAnimalASecado={this.confirmEnviarAnimalASecado}
                      removerDeListaHandler={this.removerDeListaHandler}
                      vacasCapturadas={vacasCapturadas}
                      vacasSinSalvar={vacasSinSalvar}
                    />
                  </div>
                  <div className=" col-lg-2">
                    {btnDone}
                  </div>
                </div>
              </div>
              <div className=" col-lg-1" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>

              </div>
            </div>


            <div style={{ display: `${!this.state.visualizarAvance ? 'block' : 'none'}` }} >
              <Container>
                <Row>
                  <Col xs={1}>
                    {btnAtras}
                  </Col>
                  <Col xs={3}>
                    <ListaCaptura data={this.state.data} seleccionarRegistro={this.seleccionarRegistro}
                      cargandoLista={this.state.cargandoListaCaptura}
                      filtroCapturaSeleccionado={this.props.filtroCapturaSeleccionado}
                      confirmEnviarAnimalASecado={this.confirmEnviarAnimalASecado}
                      sendFocusToOrdenia1={this.sendFocusToOrdenia1}
                    />
                  </Col>
                  <Col xs={4}>
                    <div>
                      <Captura registroSeleccionado={this.state.registroSeleccionado} tipoRegistro={this.state.tipoRegistro}
                        CardOpcionSecado={this.state.CardOpcionSecado} marcarAnimalSecado={this.marcarAnimalSecado}
                        claveBuscar={this.state.claveBuscar} actualizarClaveHandler={this.actualizarClaveHandler}
                        actualizarOrd={this.actualizarOrd} setValorOrdenia={this.setValorOrdenia} ord1={this.state.ord1} ord2={this.state.ord2}
                        actualizarDatosHandler={this.actualizarDatosCapturaHandler}
                        cancelarRegistroSeleccionado={this.cancelarRegistroSeleccionado}
                        marcarAnimalSecadoHandler={this.marcarAnimalSecadoHandler}

                        buscarAnimalHandler={this.buscarAnimalHandler}
                        buscarAnimalOnBlurHandler={this.buscarAnimalOnBlurHandler}

                        handleOrdenia2={this.handleFocusToOrdenia2}


                        tbClaveRef={this.tbClave}
                        tbOrdenia1Ref={this.tbOrdenia1}
                        tbOrdenia2Ref={this.tbOrdenia2}

                      />

                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-lg-2" ></div>
                            <div className="col-lg-8" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                              <Button texto="Marcar Secado" onClick={() => this.marcarAnimalSecadoHandler(true)}
                                isVisible={this.state.tipoRegistro === 1}
                                isTextLeft={true}
                                disabled={this.state.registroSeleccionado === null} glyph="siguiente" />
                              <Button onClick={() => this.marcarAnimalSecadoHandler(false)}
                                isVisible={this.state.tipoRegistro === 2}
                                texto="Cancelar secado"
                                disabled={this.state.registroSeleccionado === null} />
                            </div>
                            <div className="col-lg-2" ></div>
                          </div>
                        </Card.Body>
                      </Card>
                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-lg-4" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                              <h5>Pendientes:</h5>
                            </div>
                            <div className="col-lg-2" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                              <h4>{vacasPendientes}</h4>
                            </div>
                            <div className="col-lg-3" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                              <h5>Secar:</h5>
                            </div>
                            <div className="col-lg-3" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                              <h4>{vacasMarcadas}</h4>
                            </div>
                          </div>
                          <CommonRow />
                          <div className="row">
                            <div className="col-lg-6" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                              <Button glyph="folder-open" texto="Ver avance" onClick={() => this.verCapturaHandler(true)} />
                            </div>
                            <div className="col-lg-6" style={{ justifyContent: 'center', verticalAlign: 'middle', display: 'flex' }}>
                              <Button bsStyle="success" onClick={() => this.salvarAvanceHandler()}
                                disabled={this.state.disableSalvarAvance} glyph="bookmark" texto="Salvar" />
                            </div>
                          </div>

                        </Card.Body>
                      </Card>
                    </div>
                  </Col>
                  <Col xs={3}>
                    <ListaSecado seleccionarRegistro={this.seleccionarRegistro}

                      data={this.props.data.filter(animal => this.esAnimalPendiente(animal))}


                      cargandoListaSecado={this.state.cargandoListaSecado}
                      filtroCapturaSeleccionado={this.props.filtroCapturaSeleccionado}
                      confirmEnviarAnimalASecado={this.confirmEnviarAnimalASecado} />
                  </Col>
                  <Col xs={1}>
                    {btnSiguiente}
                  </Col>
                </Row>

              </Container>

            </div>

          </div>



        </div>


      </Aux>

    )
  };
}


// Reducers
const mapStateToProps = state => {
  return {

    isLoading: state.ordenia.loading,

    // INICIO MENSAJES
    visible: state.ordenia.visible,
    mostrarMensaje: state.ordenia.mostrarMensaje,
    mensaje: state.ordenia.mensaje,
    tipoMensaje: state.ordenia.tipoMensaje,
    // FIN MENSAJES

    data: state.ordenia.data,
    lote: state.ordenia.lote,
    loteId: state.ordenia.loteId,
    motivosSecado: state.ordenia.motivosSecado,
    gruposProductivos: state.ordenia.gruposProductivos,
    fechaCaptura: state.ordenia.fechaCaptura,

    loteDestinoDefault: state.ordenia.loteDestinoDefault,

    pesadaNoEncontrada: state.ordenia.pesadaNoEncontrada,

  }
}

// Actions
const mapDispatchToProps = dispatch => {
  return {

    onActualizarNumeroPaso: (numeroPaso) => dispatch(at.ulActualizarNumeroPaso(numeroPaso)),

    onMostrarOcultarMensaje: (mostrarMensaje, tipoMensaje, mensaje) => dispatch(at.ordMostrarOcultarMensaje(mostrarMensaje, tipoMensaje, mensaje)),

    onGetProcesoCaptura: (loteId, fechaCaptura, fn, fnActualizarData, filtrarSoloSecado) => dispatch(at.ordGetProcesoCaptura(loteId, fechaCaptura, fn, fnActualizarData, filtrarSoloSecado)),

    onMarcarAnimalSecado: (marcarSecado, registroSeleccionado, fn) => dispatch(at.ordMarcarAnimalSecado(marcarSecado, registroSeleccionado, fn)),

    onSalvarAvance: (loteId, datos, funcionError, funcionSuccess, devolverData) => dispatch(at.ordSalvarAvance(loteId, datos, funcionError, funcionSuccess, devolverData)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(C02_CapturaProcesoContainer);