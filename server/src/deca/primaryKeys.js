function swap(obj) {
  var ret = {};
  for (var key in obj) {
    ret[obj[key]] = key;
  }
  return ret;
}

let mapper = {
  alt_id: "alternant",
  cdp_id: "code_diplome",
  idc_id: "code_idcc",
  naf_id: "code_naf",
  rnc_id: "code_rncp",
  com_id: "commune",
  dep_id: "departement",
  ctr_id: "details_contrat",
  dis_id: "dispositif",
  dossier_id: "dossier",
  emp_id: "employeur",
  ems_id: "employeur_specifique",
  ofp_id: "etablissement_formation",
  frm_id: "formation",
  mca_id: "mode_contractuel_apprentissage",
  mrf_id: "motif_refus_financement",
  mdr_id: "motif_rupture",
  nat_id: "nationalite",
  ndc_id: "nature_contrat",
  nda_id: "orga_forma_declaration_activite",
  odp_id: "organisme_depot",
  odf_id: "organisme_formation",
  pay_id: "pays",
  rgs_id: "regime_social",
  reg_id: "region",
  rem_id: "remuneration_annuelle",
  rev_id: "repetition_voie",
  rle_id: "responsable_legal",
  rupture_id: "rupture",
  sex_id: "sexe",
  sac_id: "situation_avant_contrat",
  dos_id: "suivi_contrat",
  cls_id: "suivi_formation",
  tut_id: "tuteur",
  tca_id: "type_contrat_apprentissage",
  tcp_id: "type_contrat_prof_pro_a",
  tdd_id: "type_derogation",
  det_id: "type_diplome",
  tem_id: "type_employeur",
  tms_id: "type_minimum_social",
  tdq_id: "type_qualification",
  tsl_id: "type_salaire",
  tdv_id: "type_voie",
  uai_id: "uai_etablissements_formation",
  vde_id: "veracite_elements",
};
module.exports = {
  findTableName: (key) => {
    return mapper[key.startsWith("tuteur") ? "tut_id" : key];
  },
  findPrimaryKey: (tableName) => {
    return swap(mapper)[tableName];
  },
};
