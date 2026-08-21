import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MyProposalCard = ({ proposal }) => {

  if (!proposal) return null

  return (

    <Card className="border-indigo-500 border">

      <CardHeader>
        <CardTitle>My Guide Proposal</CardTitle>
      </CardHeader>

      <CardContent className="flex justify-between items-center">

        <div>

          <p className="font-medium">
            Guide: {proposal.guide.name}
          </p>

          <p className="text-sm text-muted-foreground">
            {proposal.guide.email}
          </p>

        </div>

        <Badge variant="secondary">
          {proposal.status}
        </Badge>

      </CardContent>

    </Card>
  )
}

export default MyProposalCard