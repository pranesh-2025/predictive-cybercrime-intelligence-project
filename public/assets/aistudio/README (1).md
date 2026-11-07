# Predictive Cybercrime Intelligence System

An AI-assisted cyber-fraud intelligence prototype that combines
transaction relationship analysis, graph machine learning, geospatial
analysis, and investigator review to identify potential cash-withdrawal
hotspots.

> **Project:** Smart India Hackathon (SIH)\
> **Problem Statement ID:** 26184\
> **Theme:** Blockchain & Cybersecurity\
> **Category:** Software

## Overview

Cyber-fraud investigations can involve many connected complaints,
accounts, transactions, and locations. Following these relationships and
identifying where funds may be withdrawn next can be challenging.

This project proposes an end-to-end intelligence workflow that processes
authorized or synthetic data, constructs a relationship graph, applies
graph-based and spatiotemporal analysis, and presents potential risk
areas through a GIS heatmap. The output is intended to support
authorized investigators; it does not replace human judgement or
establish that a person, account, bank, or location is involved in a
crime.

## Objectives

-   Connect related complaints, accounts, transactions, and geographic
    locations.
-   Identify suspicious transaction relationships and patterns for
    further review.
-   Estimate potential future cash-withdrawal hotspots using time and
    location signals.
-   Visualize risk areas and supporting explanations on a map.
-   Support an investigator-led review and alert workflow.
-   Use verified outcomes to evaluate and improve models through
    controlled updates.

## Proposed System Architecture

``` text
                 DATA SOURCES
       Complaints | Transactions | UPI | ATM | GIS
                         |
                         v
                  DATA INGESTION
          Cleaning | Normalization | Features
                         |
                         v
                GRAPH CONSTRUCTION
       Complaint <-> Account <-> Transaction <-> Location
                         |
                         v
             GRAPH INTELLIGENCE ENGINE
               GraphSAGE / GAT
                 Time + Location
                         |
                         v
           GEO-SPATIOTEMPORAL PREDICTION
                  DBSCAN + H3
                         |
                         v
                 RISK SCORING
             Score | Reason | Hotspot
                         |
                         v
                  GIS HEATMAP
                         |
                         v
               INVESTIGATOR REVIEW <--- Authorized CCTV
                         |                CV anomaly flags
                         v
                  ALERT & REPORT
             Authorized LEA / Bank / I4C
                         |
                         v
                OUTCOME FEEDBACK
              Reviewed model updates
```

## Main Modules

### 1. Data ingestion and preprocessing

Collects permitted complaint, transaction, account, timestamp, and
location fields. Performs validation, cleaning, normalization, and
feature engineering.

### 2. Graph construction

Models entities such as complaints, accounts, transactions, ATMs, and
locations as graph nodes and their relationships as edges.

### 3. Graph intelligence

Explores GraphSAGE and Graph Attention Networks (GAT) to learn patterns
from connected entities and their features.

### 4. Geo-spatiotemporal prediction

Combines temporal and geographic signals to estimate areas that may
require attention. DBSCAN can be used for spatial clustering and H3 for
geographic grid representation.

### 5. Risk scoring and explainability

Produces a risk score with supporting factors so that an investigator
can understand why an area or pattern was flagged.

### 6. GIS visualization

Displays risk levels and candidate hotspots on an interactive map.

### 7. Investigator review and alerts

Presents findings for authorized human review. Where legally authorized
and available, CCTV footage and computer-vision anomaly flags may be
used as supporting information. Alerts and reports are intended for
approved channels.

### 8. Outcome feedback

Uses reviewed outcomes for model evaluation and controlled updates.
Unverified outcomes should not trigger automatic model retraining.

## Proposed Technology Stack

  Layer                     Technology
  ------------------------- -----------------------------------
  Frontend                  React
  Backend API               Python, FastAPI
  Graph machine learning    PyTorch Geometric, GraphSAGE, GAT
  Database                  PostgreSQL, PostGIS
  Map visualization         Leaflet
  Graph visualization       Cytoscape.js
  Spatial clustering        DBSCAN, H3
  Optional video analysis   Computer-vision anomaly detection

The table describes the proposed stack. Update it as each component is
implemented and verified.

## Repository Structure

``` text
predictive-cybercrime-intelligence/
├── frontend/              # React application
├── backend/               # FastAPI application and API routes
├── ml/                    # Graph ML and prediction modules
├── data/
│   └── sample/            # Synthetic, non-sensitive sample data
├── docs/                  # Architecture and project documentation
├── tests/                 # Automated tests
├── .gitignore
└── README.md
```

Adapt this structure to match the actual folders in the repository.

## Getting Started

The project setup instructions will be added as the frontend, backend,
database, and ML modules are finalized. Before publishing setup
commands, verify them against the current repository.

For local development, the expected components are:

-   A supported Python environment for the backend and ML modules.
-   Node.js and npm for the React frontend.
-   PostgreSQL with PostGIS if the geospatial database module is
    enabled.
-   Environment variables for local configuration; do not commit
    secrets.

## Data and Responsible Use

-   Use synthetic data for public demonstrations unless real data access
    is explicitly authorized.
-   Never commit personal information, bank account details,
    credentials, private transaction records, or identifiable CCTV
    footage.
-   Apply data minimization, access control, encryption, retention
    limits, and audit logging in any real deployment.
-   CCTV access must be lawful, authorized, purpose-limited, and
    governed by the relevant institutional process.
-   Treat predictions as investigative leads, not proof or automatic
    grounds for action.
-   Evaluate accuracy, false-positive rates, bias, and geographic
    coverage before operational use.
-   Keep a human investigator responsible for reviewing and approving
    actions.

## Project Status

**Status: Prototype / development.**

This repository documents the proposed architecture and implementation
direction. A module should be described as completed only after it has
been implemented and tested. Screenshots, demo data, and performance
results should be clearly labelled as simulated when applicable.

## Evaluation Metrics

Potential evaluation measures include:

-   Data validation and preprocessing quality
-   Graph construction correctness
-   Precision, recall, F1-score, and false-positive rate
-   Hotspot prediction quality on appropriately labelled test data
-   Spatial and temporal usefulness of predictions
-   Explainability of risk scores
-   Map usability and investigator workflow
-   Privacy and security controls

## Contributing

Contributions and suggestions are welcome. For major changes, open an
issue before submitting a pull request. Do not contribute confidential,
personal, banking, or surveillance data.

## Disclaimer

This is an academic/hackathon-oriented project and prototype. It is not
an operational law-enforcement system. Model outputs may be inaccurate
and must not be treated as proof of wrongdoing. Real-world deployment
would require lawful data access, independent validation, security
review, institutional authorization, and human oversight.

## Acknowledgement

Developed as a proposed solution for **Smart India Hackathon, Problem
Statement 26184**.
