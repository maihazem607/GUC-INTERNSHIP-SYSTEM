import React from "react";
import styles from "./EvaluationDetailsModal.module.css";
import EvaluationModalAdapter from "../SCAD/EvaluationModalAdapter";
import { Evaluation } from "../SCAD/EvaluationList";

interface EvaluationDetailsModalProps {
  evaluation: Evaluation;
  onClose: () => void;
  onUpdate?: (id: number, performanceRating: number, skillsRating: number, attitudeRating: number, comments: string) => void;
  onDelete?: (id: number) => void;
}

const EvaluationDetailsModal: React.FC<EvaluationDetailsModalProps> = ({
  evaluation,
  onClose,
  onUpdate,
  onDelete
}) => {  return (
    <EvaluationModalAdapter
      evaluation={evaluation}
      onClose={onClose}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
};

export default EvaluationDetailsModal;