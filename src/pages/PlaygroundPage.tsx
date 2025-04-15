import ExpandableText from "../components/ExpandableText";
import Onboarding from "../components/Onboarding";
import OrderStatusSelector from "../components/OrderStatusSelector";
import TermsAndConditions from "../components/TermsAndConditions";

const PlaygroundPage = () => {
  
  return <OrderStatusSelector onChange={(status) => console.log(status)} />;
};

export default PlaygroundPage;
