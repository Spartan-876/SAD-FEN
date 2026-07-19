% ============================================================
% SISTEMA EXPERTO PARA EVALUACIÓN DE VULNERABILIDAD
% ANTE EL FENÓMENO EL NIÑO - LAMBAYEQUE
% ============================================================
% Archivo: sistema_experto_lambayeque.pl
% Descripción: Base de conocimiento, reglas de inferencia,
%              motor de recomendaciones y ejemplos de uso.
%              VERSIÓN AMPLIADA CON RECOMENDACIONES ESPECÍFICAS
% ============================================================

% ---- Base de Conocimiento Dinámica (Hechos por Vivienda) ----
:- dynamic zona/2.                    % P1: urbana/rural
:- dynamic material_muro/2.           % P2: noble/precario
:- dynamic techo/2.                   % P3: inclinado/plano
:- dynamic almacenamiento_agua/2.     % P4: tecnificado/precario
:- dynamic poblacion_vulnerable/2.    % P5: si/no
:- dynamic techo_protegido/2.         % P6: adecuado/inadecuado

:- dynamic valvula_check/2.           % P7: si/no (Urbana)
:- dynamic altura_electrica/2.        % P8: segura/baja (Urbana)
:- dynamic absorcion_calle/2.         % P9: buena/mala (Urbana)
:- dynamic ambiente_hundido/2.        % P10: no/si (Urbana)
:- dynamic respaldo_energia/2.        % P11: si/no (Urbana)

:- dynamic proximidad_rio/2.          % P7_R: lejos/cerca (Rural)
:- dynamic refugio_alto/2.            % P8_R: si/no (Rural)
:- dynamic dependencia_agropecuaria/2.% P9_R: no/si (Rural)
:- dynamic suelo_humedad/2.           % P10_R: drena/retiene (Rural)
:- dynamic radio_comunicacion/2.      % P11_R: si/no (Rural)

:- dynamic criaderos_vectores/2.      % P12: no/si
:- dynamic kit_medico/2.              % P13: si/no
:- dynamic alimentos_elevados/2.      % P14: si/no
:- dynamic red_apoyo_vecinal/2.       % P15: si/no

% ============================================================
% REGLAS DE INFERENCIA
% ============================================================

% ---- 1. VULNERABILIDAD ESTRUCTURAL ----
% Fundamento: NTE E.080 - comportamiento del adobe ante saturación
% -------------------------------------------------------------
vulnerabilidad_estructural(Id, muy_alta) :-
    material_muro(Id, precario),
    techo(Id, plano),
    techo_protegido(Id, inadecuado), !.

vulnerabilidad_estructural(Id, alta) :-
    material_muro(Id, precario),
    ( techo(Id, plano); techo_protegido(Id, inadecuado) ), !.

vulnerabilidad_estructural(Id, media) :-
    material_muro(Id, precario), !.

vulnerabilidad_estructural(Id, media) :-
    material_muro(Id, noble),
    techo(Id, plano), !.

vulnerabilidad_estructural(Id, baja) :-
    material_muro(Id, noble),
    techo(Id, inclinado).

% ---- 2. VULNERABILIDAD SANITARIA ----
% Fundamento: Diseño del alcantarillado EPSSEL, no segregado
% -------------------------------------------------------------
vulnerabilidad_sanitaria(Id, alta) :-
    zona(Id, urbana),
    valvula_check(Id, no), !.

vulnerabilidad_sanitaria(Id, media) :-
    zona(Id, urbana),
    valvula_check(Id, si), !.

vulnerabilidad_sanitaria(Id, no_aplica) :-
    zona(Id, rural).

% ---- 3. RIESGO ELÉCTRICO ----
% Fundamento: Código Nacional de Electricidad - distancias de seguridad
% -------------------------------------------------------------
riesgo_electrico(Id, alto) :-
    zona(Id, urbana),
    altura_electrica(Id, baja), !.

riesgo_electrico(Id, bajo) :-
    zona(Id, urbana),
    altura_electrica(Id, segura), !.

riesgo_electrico(Id, no_aplica) :-
    zona(Id, rural).

% ---- 4. RIESGO HIDROLÓGICO ----
% Fundamento: Inundación pluvial (urbana) / fluvial (rural)
% -------------------------------------------------------------
% 4a: Rama Urbana
riesgo_hidrologico(Id, muy_alto) :-
    zona(Id, urbana),
    absorcion_calle(Id, mala),
    ambiente_hundido(Id, si), !.

riesgo_hidrologico(Id, alto) :-
    zona(Id, urbana),
    absorcion_calle(Id, mala), !.

riesgo_hidrologico(Id, medio) :-
    zona(Id, urbana),
    ambiente_hundido(Id, si), !.

riesgo_hidrologico(Id, bajo) :-
    zona(Id, urbana),
    absorcion_calle(Id, buena),
    ambiente_hundido(Id, no), !.

% 4b: Rama Rural
riesgo_hidrologico(Id, muy_alto) :-
    zona(Id, rural),
    proximidad_rio(Id, cerca),
    suelo_humedad(Id, retiene), !.

riesgo_hidrologico(Id, alto) :-
    zona(Id, rural),
    proximidad_rio(Id, cerca), !.

riesgo_hidrologico(Id, medio) :-
    zona(Id, rural),
    suelo_humedad(Id, retiene), !.

riesgo_hidrologico(Id, bajo) :-
    zona(Id, rural),
    proximidad_rio(Id, lejos),
    suelo_humedad(Id, drena).

% ---- 5. RIESGO EPIDEMIOLÓGICO ----
% Fundamento: Alertas MINSA/GERESA sobre dengue y leptospirosis
% -------------------------------------------------------------
riesgo_epidemiologico(Id, alto) :-
    criaderos_vectores(Id, si),
    almacenamiento_agua(Id, precario), !.

riesgo_epidemiologico(Id, medio) :-
    criaderos_vectores(Id, si), !.

riesgo_epidemiologico(Id, medio) :-
    almacenamiento_agua(Id, precario), !.

riesgo_epidemiologico(Id, bajo) :-
    criaderos_vectores(Id, no),
    almacenamiento_agua(Id, tecnificado).

% ---- 6. CAPACIDAD DE RESILIENCIA ----
% Fundamento: Manual EVAR CENEPRED - fragilidad social + resiliencia
% -------------------------------------------------------------
factor_fragilidad(Id, alta) :-
    poblacion_vulnerable(Id, si).

factor_fragilidad(Id, baja) :-
    poblacion_vulnerable(Id, no).

factor_preparacion(Id, Puntaje) :-
    findall(1, factor_positivo(Id), Positivos),
    length(Positivos, Puntaje).

factor_positivo(Id) :- kit_medico(Id, si).
factor_positivo(Id) :- alimentos_elevados(Id, si).
factor_positivo(Id) :- red_apoyo_vecinal(Id, si).
factor_positivo(Id) :- zona(Id, urbana), respaldo_energia(Id, si).
factor_positivo(Id) :- zona(Id, rural), refugio_alto(Id, si).
factor_positivo(Id) :- zona(Id, rural), radio_comunicacion(Id, si).

capacidad_resiliencia(Id, baja_resiliencia) :-
    factor_fragilidad(Id, alta),
    factor_preparacion(Id, Puntaje),
    Puntaje =< 1, !.

capacidad_resiliencia(Id, media_resiliencia) :-
    factor_preparacion(Id, Puntaje),
    Puntaje >= 2,
    Puntaje =< 3, !.

capacidad_resiliencia(Id, alta_resiliencia) :-
    factor_preparacion(Id, Puntaje),
    Puntaje >= 4.

% ---- 7. CLASIFICACIÓN DE RIESGO GLOBAL ----
% -------------------------------------------------------------
peso_nivel(muy_alto, 4).
peso_nivel(muy_alta, 4).
peso_nivel(alto, 3).
peso_nivel(alta, 3).
peso_nivel(medio, 2).
peso_nivel(media, 2).
peso_nivel(bajo, 1).
peso_nivel(baja, 1).
peso_nivel(no_aplica, 0).

nivel_riesgo_global(Id, Global) :-
    vulnerabilidad_estructural(Id, VE),
    peso_nivel(VE, PE),
    vulnerabilidad_sanitaria(Id, VS),
    peso_nivel(VS, PS),
    riesgo_electrico(Id, RE),
    peso_nivel(RE, PRE),
    riesgo_hidrologico(Id, RH),
    peso_nivel(RH, PRH),
    riesgo_epidemiologico(Id, REP),
    peso_nivel(REP, PREP),
    Maximo is max(PE, max(PS, max(PRE, max(PRH, PREP)))),
    ( Maximo =:= 4 -> Global = muy_alto
    ; Maximo =:= 3 -> Global = alto
    ; Maximo =:= 2 -> Global = medio
    ; Global = bajo ).

% ============================================================
% MOTOR DE RECOMENDACIONES
% ============================================================
% Las recomendaciones dependen del NIVEL DE RIESGO INFERIDO,
% nunca directamente de la respuesta cruda del usuario.
% ============================================================

% ---- Hechos de Recomendación Genéricas ----
recomendacion(estructural, 'Reforzar o sustituir los muros de adobe y corregir la pendiente del techo').
recomendacion(sanitaria, 'Instalar una válvula check antirretorno en la conexión de desagüe').
recomendacion(electrico, 'Elevar tomacorrientes y llave general a una altura segura').
recomendacion(hidrologico_urbano, 'Evitar el uso de ambientes hundidos durante alertas de lluvia y gestionar drenaje temporal').
recomendacion(hidrologico_rural, 'Identificar y ensayar la ruta hacia el refugio alto más cercano ante desborde del río').
recomendacion(epidemiologico, 'Eliminar criaderos de agua estancada y tapar los reservorios de almacenamiento').
recomendacion(resiliencia, 'Reforzar el kit médico familiar, las reservas elevadas de alimentos y coordinar con la junta vecinal').

% ---- Hechos de Recomendación Específicas ----
% Estructurales
recomendacion(estructural_techo_plano, 'Priorizar la instalación de un techo inclinado con calaminas para evitar la acumulación de agua que debilita los muros de adobe.').
recomendacion(estructural_proteccion, 'Asegurar correctamente los plásticos con una estructura inclinada y clavada, no solo con peso muerto, para proteger los muros de adobe.').
recomendacion(estructural_loza_plana, 'Revisar los sumideros y la membrana impermeable del techo plano para evitar filtraciones que afecten la estructura de concreto.').

% Sanitarias
recomendacion(sanitaria_calle_empozada, 'Instalar una válvula check antirretorno y, además, colocar sacos de arena en la puerta para evitar el ingreso de agua de la calle.').
recomendacion(sanitaria_sotano, 'Instalar una válvula check y elevar todos los equipos y muebles del sótano o ambiente hundido.').

% Epidemiológicas
recomendacion(epidemiologica_criaderos, 'Eliminar todos los recipientes que acumulan agua (llantas, botellas, latas) y tapar herméticamente los baldes y bidones de almacenamiento.').
recomendacion(epidemiologica_techo_plano, 'Revisar el techo plano, ya que puede acumular agua de lluvia y convertirse en un criadero de mosquitos.').

% Resiliencia
recomendacion(resiliencia_apoyo, 'Coordinar con los vecinos para que una persona esté designada para ayudar a los niños, ancianos o personas con discapacidad durante la evacuación.').
recomendacion(resiliencia_kit_agua, 'Adquirir un botiquín con suero oral y medicamentos para diarrea, ya que el almacenamiento de agua en baldes aumenta el riesgo de contaminación.').
recomendacion(resiliencia_alimentos, 'Elevar todos los alimentos no perecederos a repisas altas, ya que el agua de la calle puede ingresar por los ambientes hundidos.').

% Hidrológicas rurales
recomendacion(hidrologico_rural_evacuar, 'Ante la alerta de lluvias intensas, evacuar hacia el refugio alto identificado y asegurar los animales de corral en zonas elevadas.').
recomendacion(hidrologico_rural_refugio, 'Identificar de forma urgente un punto alto cercano (cerro, colegio, iglesia) y coordinar con la comunidad un plan de evacuación vertical.').

% Protección de activos agropecuarios
recomendacion(proteccion_activos, 'Proteger los animales de corral y cultivos, reubicándolos temporalmente en zonas altas o asegurando los corrales ante la crecida del río.').

% ---- Reglas de activación de recomendaciones genéricas ----
aplica_recomendacion(Id, R) :-
    vulnerabilidad_estructural(Id, Nivel),
    member(Nivel, [alta, muy_alta]),
    recomendacion(estructural, R).

aplica_recomendacion(Id, R) :-
    vulnerabilidad_sanitaria(Id, Nivel),
    member(Nivel, [alta]),
    recomendacion(sanitaria, R).

aplica_recomendacion(Id, R) :-
    riesgo_electrico(Id, alto),
    recomendacion(electrico, R).

aplica_recomendacion(Id, R) :-
    zona(Id, urbana),
    riesgo_hidrologico(Id, Nivel),
    member(Nivel, [alto, muy_alto]),
    recomendacion(hidrologico_urbano, R).

aplica_recomendacion(Id, R) :-
    zona(Id, rural),
    riesgo_hidrologico(Id, Nivel),
    member(Nivel, [alto, muy_alto]),
    recomendacion(hidrologico_rural, R).

aplica_recomendacion(Id, R) :-
    riesgo_epidemiologico(Id, Nivel),
    member(Nivel, [medio, alto]),
    recomendacion(epidemiologico, R).

aplica_recomendacion(Id, R) :-
    capacidad_resiliencia(Id, baja_resiliencia),
    recomendacion(resiliencia, R).

% ---- Reglas de activación de recomendaciones específicas ----
% Estructurales específicas
aplica_recomendacion(Id, R) :-
    material_muro(Id, precario),
    techo(Id, plano),
    recomendacion(estructural_techo_plano, R).

aplica_recomendacion(Id, R) :-
    material_muro(Id, precario),
    techo_protegido(Id, inadecuado),
    recomendacion(estructural_proteccion, R).

aplica_recomendacion(Id, R) :-
    material_muro(Id, noble),
    techo(Id, plano),
    recomendacion(estructural_loza_plana, R).

% Sanitarias específicas
aplica_recomendacion(Id, R) :-
    zona(Id, urbana),
    valvula_check(Id, no),
    absorcion_calle(Id, mala),
    recomendacion(sanitaria_calle_empozada, R).

aplica_recomendacion(Id, R) :-
    zona(Id, urbana),
    valvula_check(Id, no),
    ambiente_hundido(Id, si),
    recomendacion(sanitaria_sotano, R).

% Epidemiológicas específicas
aplica_recomendacion(Id, R) :-
    criaderos_vectores(Id, si),
    almacenamiento_agua(Id, precario),
    recomendacion(epidemiologica_criaderos, R).

aplica_recomendacion(Id, R) :-
    criaderos_vectores(Id, si),
    techo(Id, plano),
    recomendacion(epidemiologica_techo_plano, R).

% Resiliencia específica
aplica_recomendacion(Id, R) :-
    poblacion_vulnerable(Id, si),
    red_apoyo_vecinal(Id, no),
    recomendacion(resiliencia_apoyo, R).

aplica_recomendacion(Id, R) :-
    kit_medico(Id, no),
    almacenamiento_agua(Id, precario),
    recomendacion(resiliencia_kit_agua, R).

aplica_recomendacion(Id, R) :-
    alimentos_elevados(Id, no),
    ambiente_hundido(Id, si),
    recomendacion(resiliencia_alimentos, R).

% Hidrológicas rurales específicas
aplica_recomendacion(Id, R) :-
    zona(Id, rural),
    proximidad_rio(Id, cerca),
    suelo_humedad(Id, retiene),
    recomendacion(hidrologico_rural_evacuar, R).

aplica_recomendacion(Id, R) :-
    zona(Id, rural),
    proximidad_rio(Id, cerca),
    refugio_alto(Id, no),
    recomendacion(hidrologico_rural_refugio, R).

% Protección de activos agropecuarios
aplica_recomendacion(Id, R) :-
    zona(Id, rural),
    dependencia_agropecuaria(Id, si),
    recomendacion(proteccion_activos, R).

% ---- Predicado principal para obtener todas las recomendaciones ----
recomendar(Id, Lista) :-
    findall(R, aplica_recomendacion(Id, R), Lista).

% ============================================================
% EJEMPLO DE USO Y CARGA DE DATOS DE PRUEBA
% ============================================================
% Para probar el sistema, descomentar las siguientes líneas
% y ejecutar las consultas al final.
% ============================================================

:- initialization(
   (
    % Limpiar hechos previos (por si acaso)
    retractall(zona(_,_)),
    retractall(material_muro(_,_)),
    retractall(techo(_,_)),
    retractall(almacenamiento_agua(_,_)),
    retractall(poblacion_vulnerable(_,_)),
    retractall(techo_protegido(_,_)),
    retractall(valvula_check(_,_)),
    retractall(altura_electrica(_,_)),
    retractall(absorcion_calle(_,_)),
    retractall(ambiente_hundido(_,_)),
    retractall(respaldo_energia(_,_)),
    retractall(criaderos_vectores(_,_)),
    retractall(kit_medico(_,_)),
    retractall(alimentos_elevados(_,_)),
    retractall(red_apoyo_vecinal(_,_)),
    retractall(proximidad_rio(_,_)),
    retractall(refugio_alto(_,_)),
    retractall(dependencia_agropecuaria(_,_)),
    retractall(suelo_humedad(_,_)),
    retractall(radio_comunicacion(_,_)),

    % Insertar hechos de ejemplo para una vivienda urbana (v001)
    assert(zona(v001, urbana)),
    assert(material_muro(v001, precario)),
    assert(techo(v001, plano)),
    assert(techo_protegido(v001, inadecuado)),
    assert(valvula_check(v001, no)),
    assert(altura_electrica(v001, baja)),
    assert(absorcion_calle(v001, mala)),
    assert(ambiente_hundido(v001, si)),
    assert(respaldo_energia(v001, no)),
    assert(almacenamiento_agua(v001, precario)),
    assert(poblacion_vulnerable(v001, si)),
    assert(criaderos_vectores(v001, si)),
    assert(kit_medico(v001, no)),
    assert(alimentos_elevados(v001, no)),
    assert(red_apoyo_vecinal(v001, no)),

    % Insertar hechos de ejemplo para una vivienda rural (v002)
    assert(zona(v002, rural)),
    assert(material_muro(v002, precario)),
    assert(techo(v002, plano)),
    assert(techo_protegido(v002, inadecuado)),
    assert(almacenamiento_agua(v002, precario)),
    assert(poblacion_vulnerable(v002, si)),
    assert(criaderos_vectores(v002, si)),
    assert(kit_medico(v002, no)),
    assert(alimentos_elevados(v002, no)),
    assert(red_apoyo_vecinal(v002, no)),
    assert(proximidad_rio(v002, cerca)),
    assert(suelo_humedad(v002, retiene)),
    assert(refugio_alto(v002, no)),
    assert(radio_comunicacion(v002, no)),
    assert(dependencia_agropecuaria(v002, si))
   )
).

% ============================================================
% CONSULTAS DE EJEMPLO
% ============================================================
% Después de cargar el archivo, ejecutar en la consola de Prolog:
%
% 1. Consultar vulnerabilidad estructural de v001:
%    ?- vulnerabilidad_estructural(v001, Nivel).
%
% 2. Consultar nivel de riesgo global de v001:
%    ?- nivel_riesgo_global(v001, Global).
%
% 3. Obtener recomendaciones para v001:
%    ?- recomendar(v001, Lista).
%
% 4. Consultar vulnerabilidad hidrológica de v002 (rural):
%    ?- riesgo_hidrologico(v002, Nivel).
%
% 5. Obtener recomendaciones para v002 (rural):
%    ?- recomendar(v002, Lista).
%
% 6. Limpiar hechos de prueba y evaluar una nueva vivienda:
%    ?- retractall(material_muro(_,_)), assert(material_muro(v003, noble)), ...
% ============================================================