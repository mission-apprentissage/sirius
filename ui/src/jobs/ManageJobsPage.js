import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BeatLoader } from "react-spinners";

import { JOB_STATUS, JOB_STATUS_LABELS, JOB_TYPES, JOB_TYPES_LABELS } from "../constants";
import useFetchJob from "../hooks/useFetchJob";
import useFetchJobs from "../hooks/useFetchJobs";
import useStartJob from "../hooks/useStartJob";
import useStopJob from "../hooks/useStopJob";
import { Container, ManageJobsContainer, TriggerJobContainer } from "./manageJobs.style";

const jobsOption = Object.keys(JOB_TYPES).map((type) => ({
  value: type,
  label: JOB_TYPES_LABELS[type],
}));

const calculateEstimatedTime = (job) => {
  if (!job?.createdAt || !job?.updatedAt || !job?.progress || !job?.total) {
    return null;
  }

  const createdAt = new Date(job.createdAt).getTime();
  const updatedAt = new Date(job.updatedAt).getTime();

  // Calculate elapsed time in milliseconds
  const elapsedTime = updatedAt - createdAt;

  // Calculate progress rate (time per unit)
  const progressRate = elapsedTime / job.progress;

  // Estimate remaining time in milliseconds
  const remainingTime = (job.total - job.progress) * progressRate;

  // Convert remaining time to hours, minutes, and seconds
  const remainingSeconds = Math.floor(remainingTime / 1000);
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

const ManageJobsPage = () => {
  const queryClient = useQueryClient();

  const [selectedJob, setSelectedJob] = useState(null);
  const [runningJob, setRunningJob] = useState(null);
  const [onlyAlreadyAnonymizedVerbatims, setOnlyAlreadyAnonymizedVerbatims] = useState(false);
  const { jobs, isError, isLoading, isSuccess } = useFetchJobs();
  const { mutate: startJob, startedJob } = useStartJob();
  const { mutate: stopJob, stoppedJob } = useStopJob();

  const { job } = useFetchJob(runningJob?.id);

  const handleRunningJob = () => {
    if (!selectedJob) return;
    startJob({ jobType: selectedJob, onlyAnonymized: onlyAlreadyAnonymizedVerbatims });
  };

  const handleJobCancelation = () => {
    stopJob(job.id);
    setRunningJob(null);
  };

  useEffect(() => {
    const runningJobs = jobs?.filter((job) => job.status === JOB_STATUS.IN_PROGRESS);

    if (!runningJob && (job || runningJobs?.length > 0)) {
      setSelectedJob(null);
      setRunningJob(job || runningJobs[0]);
    }
  }, [jobs]);

  useEffect(() => {
    if (job && job.status === JOB_STATUS.COMPLETED) {
      setRunningJob(null);
      queryClient.invalidateQueries(["jobs"]);
    }
  }, [job]);

  return (
    <>
      <Helmet>
        <title>Gérer les jobs - Sirius</title>
      </Helmet>
      <Container>
        <ManageJobsContainer>
          <h1>
            <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
            Gestion des jobs
          </h1>
          {job?.id ? (
            <Alert
              title={
                job?.progress > 0
                  ? `Le job ${JOB_TYPES_LABELS[job?.type]} est en cours`
                  : `Le job ${JOB_TYPES_LABELS[job?.type]} est en démarrage`
              }
              description={
                job?.progress > 0 ? (
                  <div>
                    <p>
                      Progression : {Math.round((job?.progress * 100) / job?.total)}% - {job?.progress}/{job?.total}
                    </p>
                    <p>Temps restant estimé: {calculateEstimatedTime(job)}</p>
                    <br />
                    <Button onClick={handleJobCancelation}>Annuler le job</Button>
                  </div>
                ) : null
              }
              severity="info"
            />
          ) : null}
          <TriggerJobContainer>
            <Select
              label="Déclencher un job"
              disabled={!!runningJob}
              options={jobsOption}
              onChange={(event) => setSelectedJob(event.target.value)}
            />
            {selectedJob === JOB_TYPES.VERBATIMS_THEMES_EXTRACTION && (
              <Checkbox
                options={[
                  {
                    label: "Uniquement sur les verbatims déjà anonymisés",
                    nativeInputProps: {
                      name: `selectOnlyAlreadyAnonymized`,
                      checked: onlyAlreadyAnonymizedVerbatims,
                      onChange: () => setOnlyAlreadyAnonymizedVerbatims(!onlyAlreadyAnonymizedVerbatims),
                    },
                  },
                ]}
              />
            )}
            <Button disabled={!selectedJob || !!runningJob} onClick={handleRunningJob}>
              Lancer le job
            </Button>
          </TriggerJobContainer>
          <h3>Liste des jobs</h3>
          {isError && (
            <Alert
              title="Une erreur s'est produite dans le chargement des jobs"
              description="Merci de réessayer ultérieurement"
              severity="error"
            />
          )}
          {isLoading && (
            <BeatLoader color="var(--background-action-high-blue-france)" size={10} aria-label="Loading Spinner" />
          )}
          {isSuccess && jobs.length && (
            <Table
              headers={["id", "Type", "Status", "Progression", "Crée le", "Mise à jour le"]}
              data={jobs.map((job) => [
                job.id,
                JOB_TYPES_LABELS[job.type],
                JOB_STATUS_LABELS[job.status],
                job.progress > 0 ? Math.round((job.progress * 100) / job.total) + "%" : "En cours",
                new Date(job.createdAt).toLocaleString("fr-FR", {
                  timeZone: "Europe/Paris",
                }),
                new Date(job.updatedAt).toLocaleString("fr-FR", {
                  timeZone: "Europe/Paris",
                }),
              ])}
            />
          )}
        </ManageJobsContainer>
      </Container>
    </>
  );
};

export default ManageJobsPage;
