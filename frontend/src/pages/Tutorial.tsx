import { FC } from "react";
import "../styles/Tutorial.css";
import example_rows from "../assets/tutorial images/example_rows.png";
import set_params from "../assets/tutorial images/set_params.png";
import graph from "../assets/tutorial images/graph.png";
import graph_bar from "../assets/tutorial images/graph_bar.png";
import others from "../assets/tutorial images/others.png";
import protein_names from "../assets/tutorial images/protein_names.png";
import table from "../assets/tutorial images/table.png";
import manual_thresholds from "../assets/tutorial images/manual_thresholds.png";
import download_data from "../assets/tutorial images/download_data.png";
import save_results_menu from "../assets/tutorial images/save_results_menu.png";

import Menu_Geometric_Layout from "../assets/tutorial images/Menu_Geometric_Layouts.png";
import Menu_Cluster_Layout from '../assets/tutorial images/Menu_Cluster_Layout.png';
import Menu_LCSL_Random from "../assets/tutorial images/Menu_LCSL_Random.png";
import Menu_Download from '../assets/tutorial images/Menu_Download.png';
import Menu_Edge_Opacity from '../assets/tutorial images/Menu_Edge_Opacity.png';
import Menu_Node_Color from '../assets/tutorial images/Menu_Node_Color.png';
import Menu_Node_Size from '../assets/tutorial images/Menu_Node_Size.png';
import Menu_save_load from '../assets/tutorial images/Menu_save_load.png';
import Menu_SaveGraphs from '../assets/tutorial images/Menu_SaveGraphs.png';
import Menu_change_names from '../assets/tutorial images/Menu_change_names.png';

import { downloadExampleFile } from "../common/ExampleFileAction";

import { MAX_LINES_PER_FILE } from "../Constants";

const Tutorial: FC = () => {
  const stringdbLink = "https://string-db.org/";
  const drugsDatabaseLink = "https://data.tp53.org.uk/cancerdrugs.php";
  const cytoscapeLayoutsLink = "https://blog.js.cytoscape.org/2020/05/11/layouts/#choice-of-layout";
  const uniProtLink = "https://www.uniprot.org/";
  const gitLink = "https://github.com/cohenoa/ProteinNetworkSight_working";
  return (
    <div className="page-container">
      <div className="tutorial-container">
        <h1 className="t-h1">ProteinNetworkSight Tutorial</h1>
        <div>
          <p className="t-p">
            <a href="/proteinnetworksight_jce_ac_tutorial.pdf" download="tutorial.pdf">Tutorial PDF</a>
          </p>
          <h2 className="t-h2">Summary</h2>
          <p className="t-p">
            ProteinNetworkSight is a web-based tool for constructing patient-specific protein interaction networks from user-provided gene or protein scores. 
            The platform integrates quantitative input data with interaction information retrieved from the STRING database to identify biologically relevant protein clusters. 
            The resulting networks are further linked to the Cancer Drugs Database, enabling the exploration of potential therapeutic targets.
          </p>
          <p className="t-p"><a href={gitLink}>Github Repository</a></p>
          <p className="t-p">ProteinNetworkSight integrates information from two external databases:</p>
          <ol type="a">
            <li className="t-li">
              <a href={stringdbLink} target="_blank" rel="noreferrer">STRING-db</a> 
              &nbsp;- a database of known and predicted protein-protein interactions.
            </li>
            <li className="t-li">
              <a href={drugsDatabaseLink} target="_blank" rel="noreferrer">Cancer Drugs Database</a>
              &nbsp;- a resource containing licensed anticancer drugs.
            </li>
            <li className="t-li">
              <a href={uniProtLink} target="_blank" rel="noreferrer">UniProt</a> 
              &nbsp;- a protein sequence and functional information resource.
            </li>
          </ol>
          <p className="t-p">
            The generated networks allow interactive exploration of protein interactions and facilitate the identification of biologically important proteins and potential drug targets.
          </p>
        </div>
        <div>
          <h2 className="t-h2">Workflow Overview</h2>
          <p className="t-p">
            The ProteinNetworkSight analysis consists of three main steps:
          </p>
          <ol>
            <li className="t-li">Upload input data - Users upload a tabular file containing protein or gene identifiers together with numeric scores (e.g., PCA loadings, fold changes, or other quantitative metrics).</li>
            <li className="t-li">Define analysis parameters - Users specify the identifier column, numeric column prefix, interaction score thresholds, and organism of interest.</li>
            <li className="t-li">Explore the resulting networks - The platform constructs a protein interaction network using interaction data from the STRING database. Users can interactively explore the network, adjust visualization settings, and export the results in graphical or tabular formats.</li>
          </ol>
        </div>
        {/* Starting Point DIV */}
        <div>
          <h2 className="t-h2">Starting Point </h2>
          <p className="t-p">
            To begin the analysis, users must upload an Excel, CSV or a TSV containing a single sheet of tabular data. 
            Each row should correspond to a protein or gene, and each column should represent a feature.
            The file must contain no more than {MAX_LINES_PER_FILE} rows. One column should contain protein or gene identifiers, while additional columns should contain numeric values representing gene/protein scores or quantitative metrics.
          </p>
          
            {/* where each row represents a protein/gene and the columns are features to be analysed. 
            The file should contain a column of protein/gene names as well as additional column(s) of numeric values. 
            These numeric values represent gene/protein scores or quantitative metrics—such as loadings obtained from Principal Component Analysis (PCA), 
            weights from information-theoretic analyses, or simple fold changes. The first line is the header, 
            specifying column names. Note that the names of the numeric columns should start with the same prefix.
          </p> */}
          <p className="t-p">
            The first row must contain column headers.
            Numeric columns intended for analysis must share a common prefix.
          </p>
          <p className="t-p">
            An <button className="btn--here" onClick={downloadExampleFile}>example file</button>
            &nbsp;is provided (adapted from Vasudevan et al., npj Precision Oncology, 2021, Supplementary Data 1). 
            In this example, the gene identifier column is labeled “UID”, and the numeric columns begin with the prefix “G”, followed by an index.
            {/* &nbsp;you can find an example file (fetched from Vasudevan et al., npj Precision Oncology, 2021, Supplementary Data 1). 
            For example, here are 10 rows of the example file, 
            where the gene column is named “UID” and the header of the numerical columns start with “G”, followed by some index. In this specific example, 
            the columns labeled "G" represent the weights of proteins participating in computed patterns as dictated by 
            the information-theoretic analysis presented in Vasudevan et al. 
            However, this format is flexible: the "G" columns can be replaced by any other scores, 
            coefficients, or fold changes, depending on the specific method the user employs to find co-expression patterns. */}
          </p>
          <p className="t-p">
            In this dataset, the G columns represent protein weights derived from the information-theoretic analysis described in Vasudevan et al. 
            However, the format is flexible, and these columns may contain any quantitative scores, coefficients, or fold-change values, depending on the method used to identify co-expression patterns.
          </p>
          <a href={example_rows} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={example_rows} alt="example_rows" />
          </a>
        </div>
        {/* Setting parameters and thresholds DIV */}
        <div>
          <h2 className="t-h2">Setting parameters and thresholds </h2>
          <p className="t-p">In this step the user should specify:</p>
          <ol type="a">
            <li className="t-li">
              Identifier column - The header name of the protein/gene identifier column
              (e.g., “UID” in the example file).
            </li>
            <li className="t-li">
              Numeric column prefix - The prefix shared by the numeric columns
              (e.g., “G”, where Gi represents the weight of each protein in patterns such as G1, G2, G3).
            </li>
            <li className="t-li">
              STRING interaction threshold - The lower limit for the STRING interaction score, representing the probability of interaction between pairs of proteins.
            </li>
            <li className="t-li">
              Score thresholds - Positive and negative thresholds used to exclude proteins whose scores fall within a specified range.
            </li>
            <li className="t-li">
              Organism of interest -For example, Homo sapiens in the example dataset.
            </li>
          </ol>
          <a href={set_params} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={set_params} alt="set_params" />
          </a>
        </div>
        {/* Adjusting protein/gene names DIV */}
        <div>
          <h2 className="t-h2">Manual thresholds adjustments </h2>
          <p className="t-p">
          <li className="t-li">
              You can also choose to adjust the thresholds of every score (G in the example) column in the graph individually.
          </li>
          </p>
          <a href={manual_thresholds} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={manual_thresholds} alt="manual_thresholds"/>
          </a>
        </div>
        <div>
          <h2 className="t-h2">Adjusting protein/gene names </h2>
          <p className="t-p">
            ProteinNetworkSight retrieves interaction data from &nbsp;
            <a href={stringdbLink} target="_blank" rel="noreferrer">STRING-db</a>
            &nbsp;
            in order to construct and visualize protein interaction networks. 
            Therefore, protein or gene identifiers in the input file should match the names used in STRING-db. 
            Because genes often have multiple synonyms, some identifiers in the input file may not match automatically. 
            The following steps highlight such cases and allow users to select alternative identifiers.
            <br/>
             in step 3, The system suggests alternative identifiers recognized by the STRING database. For each gene, users can choose one of the suggested identifiers or manually enter an alternative identifier.
          </p>
          <a href={protein_names} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={protein_names} alt="protein_names"/>
          </a>
          <p className="t-p">
              For genes for which no alternative identifier was found automatically, in step 4 users may manually enter a valid identifier. Genes that remain unmatched will be excluded from the network analysis.
          </p>
          <a href={others} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={others} alt="others"/>
          </a>
        </div>
        {/* Results page DIV */}
        <div>
          <h2 className="t-h2">Results page</h2>
          <p className="t-p">
            The resulting network contains nodes representing proteins, where the node size is proportional to the input protein score.
            Edges are derived from STRING, and edge width represents the probability of a protein-protein interaction.
            Results can be viewed and downloaded in either a tabular or network format.
            The network view provides an interactive visualization, allowing users to zoom, drag nodes, and explore the network structure.
            {/* The resulting network comprises nodes representing the input score
            values, where node size is proportional to the input protein score
            value. The edges are derived from STRING-db, with edge width
            indicating the probability of a protein-protein interaction. The
            information can be viewed and downloaded in either a tabular or network format.
            The network format provides an interactive visualization of the network online, 
            allowing for zooming, dragging, and more complex manipulation of the
            network. */}
          </p>
          <h3 className="t-h3">Graph representation</h3>
          <p className="t-p">
            The graphical representation displays a network in which each node represents a protein.
            {/* Node size is directly proportional to the input
            value, and node color indicates the sign of the value (blue for positive
            values and red for negative values). The edges connecting each pair of
            proteins represent functional protein-protein interactions, with the
            width of each edge corresponding to the probability of such an
            interaction. */}
          </p>
          <ul>
            <li className="t-li">Node size is proportional to the input score value.</li>
            <li className="t-li">Node color indicates the sign of the value (by default blue for positive values and red for negative values).</li>
            <li className="t-li">Edges represent functional protein-protein interactions, with edge width corresponding to the interaction probability.</li>
          </ul>
          <a href={graph_bar} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={graph_bar} alt="graphBar"/>
          </a>
          <a href={graph} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={graph} alt="graph"/>
          </a>
          <p className="t-p">
            In the illustrated example, multiple protein interactions are shown. For example:, 
            
            {/* TIGAR is represented with a positive, sizeable value (indicated by the blue color) 
            and interacts with LKB1, which also has a positive but smaller value, as well as with GAPDH, 
            which is represented by a negative value (indicated by the red color). 
            Additionally, it can be inferred that ACC1 interacts with both BCL2 and FASN, with BCL2 demonstrating 
            a higher likelihood of interaction, as evidenced by the thicker edge connecting the two proteins. */}
          </p>
          <ul>
            <li className="t-li">TIGAR appears with a large positive value (blue node) and interacts with GAPDH, which has a smaller negative value.</li>
            <li className="t-li">ACC1 interacts with FASN, LKB1 and GAPDH, with the thicker edge indicating a stronger interaction probability with FASN.</li>
          </ul>
          <p className="t-p">
            Clicking on a node reveals additional information about the corresponding protein.<br/>
            Users can also drag nodes interactively to improve the layout and facilitate interpretation of the network.<br/>
          </p>
          <p className="t-p">
            The right-click context menu in the graph visualization allows users to modify visual properties and customize the appearance of the network.
          </p>
          <p className="t-p">
            Multiple layout algorithms are available to organize the graph and reveal structural patterns.<br/>
            Presented below are three fundamental options that are broadly applicable to any graph.<br/>
          </p>
          <a href={Menu_Geometric_Layout} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_Geometric_Layout} alt="Geometric layouts"/>
          </a>
          <p className="t-p">
            Additionally, advanced layout options utilizing various clustering algorithms are available to provide an alternative visualization of the graph's structure.<br/>
            We recommend exploring each of these options, as they can uncover valuable insights and reveal unique properties of the graph.<br/>
          </p>
          <a href={Menu_Cluster_Layout} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_Cluster_Layout} alt="Cluster layouts"/>
          </a>

          <p className="t-p">
            Further information about these layouts can be found in the <a href={cytoscapeLayoutsLink} target="_blank" rel="noreferrer">cytoscape.js layout documentation</a>.
            <br/>
            If you would like us to add additional layouts, please contact us.<br/>
          </p>

          <p className="t-p">
            Additionally, for users who prefer a more complex approach, the tool also provides a custom clustering algorithm, called LCSL (Layered Cluster Spiral Layout).
            Unlike traditional layouts that rely mainly on link counts, LCSL incorporates link weights when identifying clusters. Nodes within each cluster are arranged in a spiral pattern based on the weighted connectivity of each node.
            This layout is designed to facilitate the identification of important proteins and their associated therapeutic targets.
            {/* we provide a novel, hand-crafted cluster finding algorithm - named LCSL(Layered Cluster Spiral Layout) - 
            which utilizes the link weights(as opposed to link counts like previous layouts) to identify clusters and organize each cluster in a spiral pattern, 
            taking into account the weights of each node's links at every step. This algorithm is designed to facilitate the discovery and prioritization of key proteins and their respective drugs for optimal therapeutic effect. */}
          </p>
          <p className="t-p">
            For users who prefer a simpler apprach, we also provide a Random layout, which randomly places the nodes on the graph.
            You can click it multiple times to see different random results.<br/>
          </p>
          <a href={Menu_LCSL_Random} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_LCSL_Random} alt="LCSL & random layouts"/>
          </a>

          <h3 className="t-h3">Graph Appearance Options</h3>
          <p className="t-p">
            Several visual options are available to improve readability.<br/>
          </p>

          <p className="t-p">
            Node color allows selection of one of six predefined color schemes, applied separately to positive and negative nodes.<br/>
          </p>
          <a href={Menu_Node_Color} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_Node_Color} alt="node color"/>
          </a>

          <p className="t-p">
            Node size adjusts the overall size of nodes while preserving their relative size differences.<br/>
          </p>
          <a href={Menu_Node_Size} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_Node_Size} alt="node size"/>
          </a>

          <p className="t-p">
            Edge opacity controls the transparency of edges while maintaining their relative visibility.<br/>
          </p>
          <a href={Menu_Edge_Opacity} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_Edge_Opacity} alt="edge opacity"/>
          </a>

          <p className="t-p">
            Once the graph reaches the desired configuration, it can be saved using the Save option in the menu.<br/>
          </p>
          <a href={Menu_save_load} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_save_load} alt="save layout"/>
          </a>

          <p className="t-p">
            <br/>You can also toggle the labels and switch between original and STRING names.<br/>
          </p>
          <a href={Menu_change_names} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_change_names} alt="change names"/>
          </a>

          <p className="t-p">
            Alternativly, if you wish to continue working in another app, or export the result for further analysis, you can download 
            the graph in one of 3 formats:<br/>
            1. a .svg file(graph format)<br/>
            2. a .png file(picture format)<br/>
            3. a .json file(data format)<br/>
          </p>
          <a href={Menu_Download} target="_blank" rel="noopener noreferrer">
           <img className="t-img" src={Menu_Download} alt="download"/>
          </a>
          
          <h3 className="t-h3">Table representation</h3>
          <p className="t-p">
            The table view includes the following columns:
          </p>
          <ul>
            <li className="t-li">
              Original name - the identifier provided in the input file
            </li>
            <li className="t-li">
              STRING name - the matched identifier according to STRING
            </li>
            <li className="t-li">
              Node value - the input score (e.g., derived from PCA or surprisal analysis)
            </li>
            <li className="t-li">
              Node degree - number of interaction partners for each protein
            </li>
            <li className="t-li">
              Weighted node degree - sum of weighted links based on STRING interaction probabilities
            </li>
            <li className="t-li">
              Final score - average of the node size (absolute score value) and weighted node degree
            </li>
            <li className="t-li">
              Drug - known anticancer drug retrieved from the &nbsp;
              <a href={drugsDatabaseLink} target="_blank" rel="noreferrer">Cancer Drugs Database</a>
            </li>
          </ul>
          <a href={table} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={table} alt="table"/>
          </a>

          <p className="t-p">
            Users can save their work by clicking Save at the bottom of the Results window.
          </p>
          <a href={save_results_menu} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={save_results_menu} alt="save_results"/>
          </a>

          <h3 className="t-h3">Saving Data</h3>
          <p className="t-p">
            Before downloading the modified dataset, users can review and adjust gene name mappings to STRING identifiers.<br/>
            The left panel lists identifiers that have been matched or manually corrected. If desired, users can replace the original identifier with the STRING match using the arrow button.<br/>
            The right panel lists identifiers that do not have a match in STRING.<br/>
            Since these proteins do not appear in the network graphs, they may be removed from the dataset if desired.<br/>
          </p>

          <p className="t-p">
            The resulting xlsx file also contains 2 seperate sheets for the hyper-parameters used.<br/>
            Note that it is un-advised to make changes to the downloaded file if you wish to upload it later to the platform for further analysis.<br/>
          </p>
          <a href={download_data} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={download_data} alt="download data"/>
          </a>  
          
          <h3 className="t-h3">Saving Graphs</h3>
          <p className="t-p">
            Users can also apply final adjustments before downloading the generated networks.<br/>
            Global settings can be applied using the top menu(you must click apply for the settings to take effect).<br/>
            Selecting “Use preset when available” applies saved layouts only to graphs that do not already have a stored layout when using the apply all menu.<br/>
            If nodes were manually repositioned before saving, the custom layout will be preserved.<br/>
          </p>
          <a href={Menu_SaveGraphs} target="_blank" rel="noopener noreferrer">
            <img className="t-img" src={Menu_SaveGraphs} alt="download graphs"/>
          </a>
        </div>
        {/* Browser compatibility DIV */}
        <div>
          <h2 className="t-h2">Browser compatibility</h2>
          <p className="t-p">
            The following browsers and operating systems were tested for compatibility:
          </p>
          <table className="browser-support">
            <thead>
              <tr>
                <th>OS</th>
                <th>Version</th>
                <th>Chrome</th>
                <th>Edge</th>
                <th>Firefox</th>
                <th>Safari</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Windows</td>
                <td>10/11</td>
                <td>143</td>
                <td>143</td>
                <td>145</td>
                <td>n/a</td>
              </tr>
              <tr>
                <td>MacOS</td>
                <td>Sonoma</td>
                <td>143</td>
                <td>143</td>
                <td>n/a</td>
                <td>17.3</td>
              </tr>
              <tr>
                <td>Linux</td>
                <td>PopOS</td>
                <td>143</td>
                <td>n/a</td>
                <td>n/a</td>
                <td>n/a</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
