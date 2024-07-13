import FlexContainer from "@/components/FlexContainer";
import Heading from "@/components/Heading";
import Wrapper from "@/components/Wrapper";
import React from "react";

type Props = {};

const Index = (props: Props) => {
  return (
    <Wrapper>
      <FlexContainer variant="column-start" className="max-w-3xl" gap="xl">
        <Heading variant="h3">Cancellations & Refunds</Heading>
        <Heading>
          Cancellations will be considered only if the request is made
          immediately after placing the order. However, the cancellation request
          may not be entertained if the orders have been communicated to the
          vendors/merchants and they have initiated the process of shipping
          them.
        </Heading>
        <Heading>
          Neet Bucket does not accept cancellation requests for perishable items
          like flowers, eatables etc. However, refund/replacement can be made if
          the customer establishes that the quality of product delivered is not
          good.
        </Heading>
        <Heading>
          In case of receipt of damaged or defective items please report the
          same to our Customer Service team. The request will, however, be
          entertained once the merchant has checked and determined the same at
          his own end. This should be reported within 2 days of receipt of the
          products.
        </Heading>
        <Heading>
          In case you feel that the product received is not as shown on the site
          or as per your expectations, you must bring it to the notice of our
          customer service within 2 days of receiving the product. The Customer
          Service Team after looking into your complaint will take an
          appropriate decision.
        </Heading>
        <Heading>
          In case of complaints regarding products that come with a warranty
          from manufacturers, please refer the issue to them.
        </Heading>
        <Heading>
          In case of any Refunds approved by the Neet Bucket, it’ll take 6-8
          days for the refund to be processed to the end customer.
        </Heading>
      </FlexContainer>
    </Wrapper>
  );
};

export default Index;
