/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })

    test("Alors les propriétés du contour du type de dépense devraient être '2px solid #0D5AE5 !important'", () => {
      const typeDepense = screen.getByTestId('expense-type')
      expect(typeDepense.style.border = "2px solid #0D5AE5 !important").toEqual(typeDepense.style.border = "2px solid #0D5AE5 !important")
    })

    test("Alors le placeholder du nom de la dépense devrait être 'Vol Paris Londres'", () => {
      const nomDepense = screen.getByTestId('expense-name')
      expect(nomDepense.style.placeholder="Vol Paris Londres").toEqual(nomDepense.style.placeholder="Vol Paris Londres")
    })

    test("Alors un clic sur le bouton 'nouvelle facture' devrait faire apparaitre le formulaire de saisie de la nouvelle facture'", () => {
      const nouvelleFacture = screen.getByTestId('form-new-bill')
      //const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
      expect(nouvelleFacture.style.display="block").toEqual(nouvelleFacture.style.display="block")
    })
  })
})
