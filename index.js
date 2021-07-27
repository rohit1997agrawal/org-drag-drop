
import { data } from './datasource.js';

var items = new ej.data.DataManager(data);

var diagram = new ej.diagrams.Diagram({
  width: "1000px",
  height: "600px",
  dataSourceSettings: {
    id: 'id', parentId: 'manager', dataManager: items,
    doBinding: function (node, data) {
      // You will get the employee information in data argument and bind that value directly to node's built-in properties.
      node.annotations = [{ content: data.role }];
      node.style = { fill: data.color };
    }
  },
  layout: {
    type: 'OrganizationalChart'
  },
  getNodeDefaults: nodeDefaults,
  getConnectorDefaults: connectorDefaults,
  // hide the gridlines in the diagram
  snapSettings: { constraints: ej.diagrams.SnapConstraints.None },
  // trigger the drop event to update the org chart structure when drag and drop the child node.
  drop: drop
});
diagram.appendTo('#diagram');

function nodeDefaults(node) {
  node.annotations[0].style.color = "white";
  node.width = 120;
  node.constraints = ej.diagrams.NodeConstraints.Default | ej.diagrams.NodeConstraints.AllowDrop;
  return node;
}

function connectorDefaults(connector) {
  connector.type = 'Orthogonal';
  connector.targetDecorator = { shape: 'None' };
  return connector;
}

function drop(args) {
  if (args.target && args.target instanceof ej.diagrams.Node) {
    var connector = diagram.getObject(args.element.inEdges[0]);
    connector.sourceID = args.target.id;
    diagram.dataBind();
    diagram.doLayout();
    // update your local data source when modifying org chart structure.
    updateDataSource(args.element, args.target);
  }
}

function updateDataSource(source, target) {
  var updateData = data.find(function(element) {
      return element.id === source.data.id;
  });
  if(updateData) {
    updateData.manager = target.data.id;
  }
}
