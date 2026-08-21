import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const GuideCard = ({ guide, onSendProposal, disabled }) => {

  return (
    <Card className="hover:shadow-lg transition-all duration-200">

      <CardHeader className="flex flex-row items-center gap-4">

        <Avatar>
          <AvatarFallback>
            {guide.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div>
          <CardTitle className="text-lg">{guide.name}</CardTitle>

          <p className="text-sm text-muted-foreground">
            {guide.email}
          </p>
        </div>

      </CardHeader>

      <CardContent className="space-y-4">

        <Button
          className="w-full"
          disabled={disabled}
          onClick={() => onSendProposal(guide._id)}
        >
          Send Proposal
        </Button>

      </CardContent>

    </Card>
  )
}

export default GuideCard;