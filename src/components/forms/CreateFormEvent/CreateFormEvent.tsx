import { useAuth } from "@/context/auth/auth";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateEvent, useUpdateEvent } from "@/api/events";
import { Textarea } from "@/components/ui/textarea";
import "./EventForm.css";
import { useGetUserGroups } from "@/api/groups";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Event } from "dataTypes";

interface CreateEventFormProps {
  event?: Event;
  setIsViewing?: Dispatch<SetStateAction<string>>;
}

export default function CreateEventForm({ event, setIsViewing }: CreateEventFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dateOpen, setDateOpen] = useState(false)
  const initEvent: Event = {
    _id: "",
    name: "",
    ownerId: user._id,
    groupId: "",
    private: false,
    suggestionsEnabled: true,
    chatEnabled: true,
    description: "",
    location: {
      name: "",
      url: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipcode: 0,
        coordinates: {
          lat: 0,
          long: 0
        }
      }
    },
    date: null,
    time: "",
    suggestions: [],
    messages: []
  };

  const [formFields, setFormFields] = useState<Event>(event ? event : initEvent);
  const { data: groups, isLoading } = useGetUserGroups(user._id)

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {

    const { name, value } = e.target;

    if (
      name === "street"
      || name === "city"
      || name === "state"
      || name === "zipcode"
    ) {
      setFormFields((preVal) => ({
        ...preVal,
        location: {
          ...preVal.location,
          address: { ...preVal.location.address, [name]: value }
        }
      }))

    } else if (name === "url") {
      setFormFields((preVal) => ({
        ...preVal, location: { ...preVal.location, url: value }
      }))

    } else if (name === "locationName") {
      setFormFields((preVal) => ({
        ...preVal, location: { ...preVal.location, name: value }
      }))
    }

    else {
      setFormFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleDate = (newDate: Date | undefined) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      date: newDate || null,
    }));
    setDateOpen(false);
  };

  const handleTime = (e: any) => {
    setFormFields((preVal) => ({
      ...preVal, time: e.target.value
    }))
  }

  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (event && setIsViewing) {  //  update
      updateEvent.mutate(formFields, {
        onSuccess: () => {
          setIsViewing("singleEvent")
        }
      })
    } else {  //  create
      createEvent.mutate(formFields, {
        onSuccess: (response) => {
          navigate(`/events/${response._id}`)
        }
      })
    }
  };

  if (isLoading) {
    return <></>
  }

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className="create-event-form"
      style={{ marginTop: "2em" }}
    >
      <div className="form-group">
        <Label htmlFor="name" className="form-label">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formFields.name}
          onChange={handleChange}
          placeholder="Birthday Party"
          className="form-input"
          required
          aria-required="true"
        />
      </div>

      <div className="form-group">
        <Label htmlFor="description" className="form-label">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formFields.description}
          onChange={handleChange}
          placeholder="Join us for a celebration!"
          className="form-input"
          aria-required="false"
        />
      </div>

      <div className="form-group">
        <Label htmlFor="groupId" className="form-label">
          Group
        </Label>
        <Select
          name="groupId"
          value={formFields.groupId}
          onValueChange={(value) =>
            setFormFields((prevFields) => ({ ...prevFields, groupId: value }))
          }
        >
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>

            {groups?.map((group: any) => (
              //@ts-ignore will not be undefined
              <SelectItem key={group._id} value={group._id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="form-group">
        <Label className="form-label">Date</Label>
        <Popover open={dateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("form-input justify-start text-left font-normal")}
              onClick={() => { setDateOpen(true) }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formFields.date
                ? format(formFields.date, "PPP")
                : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formFields.date || undefined}
              onSelect={handleDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="form-group">
        <Label htmlFor="time" className="form-label">
          Time
        </Label>
        <Input
          type="time"
          name="time"
          value={formFields.time}
          onChange={handleTime}
          className="form-input w-[240px]"
        />
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Add Location?</AccordionTrigger>
          <AccordionContent>

            <div className="form-group">
              <Label style={{ marginTop: '1em' }} htmlFor="locationName" className="form-label">
                Name
              </Label>
              <Input
                type="text"
                id="locationName"
                name="locationName"
                // value={formFields.locationName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>


            <div className="form-group">
              <Label htmlFor="url" className="form-label">
                Website
              </Label>
              <Input
                type="url"
                id="url"
                name="url"
                value={formFields.location.url}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="street" className="form-label">
                Street
              </Label>
              <Input
                type="text"
                id="street"
                name="street"
                // value={formFields.locationStreet}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="city" className="form-label">
                City
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                // value={formFields.locationCity}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="state" className="form-label">
                State
              </Label>
              <Input
                type="text"
                id="state"
                name="state"
                // value={formFields.locationState}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="zipcode" className="form-label">
                Zipcode
              </Label>
              <Input
                type="number"
                id="zipcode"
                name="zipcode"
                // value={formFields.locationZipcode}
                onChange={handleChange}
                className="form-input"
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
            </div>

          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" style={{ marginTop: "1em" }}>
        {event ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );

  return (
    <div className="create-event-form-container">
      <h2 className="text-left" style={{ fontWeight: "300" }}>
        Create an Event
      </h2>
      {formContent}
    </div>
  );
}
