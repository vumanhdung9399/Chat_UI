import { defineStore } from "pinia";
import contactService from "@src/services/contactService";
import { IContact, IContactGroup } from "@src/types";

export const useContactStore = defineStore("contact", {
  state: () => ({
    contactGroups: [] as IContactGroup[] | undefined,
  }),
  actions: {
    async getContact() {
      try {
        const contacts = await contactService.list();
        this.contactGroups = await this.mapContactGroup(contacts.data.data);
      } catch (err) {
        console.log(err);
      }
    },
    async mapContactGroup(contacts: IContact[]) {
      if (contacts.length) {
        let sortedContacts = [...contacts];

        sortedContacts.sort();

        let groups: any[] = [];
        let currentLetter: string = "";
        let groupNames: string[] = [];

        // create an array of letter for every different sort level.
        for (let contact of sortedContacts) {
          // if the first letter is different create a new group.
          if (contact.fullName[0].toUpperCase() !== currentLetter) {
            currentLetter = contact.fullName[0].toUpperCase();
            groupNames.push(currentLetter);
          }
        }

        // create an array that groups contact names based on the first letter;
        for (let groupName of groupNames) {
          let group: any = { letter: groupName, contacts: [] };
          for (let contact of sortedContacts) {
            if (contact.fullName[0].toUpperCase() === groupName) {
              group.contacts.push(contact);
            }
          }
          groups.push(group);
        }
        return groups;
      }
    },
    async showOnOff(contactId: number, isOnline: boolean) {
      this.contactGroups?.map((item: IContactGroup) => {
        item.contacts.map((e: IContact) => {
          if (contactId == e.users_id) {
            e.isOnline = isOnline;
          }
          return e;
        });
      });
    },
  },
});
