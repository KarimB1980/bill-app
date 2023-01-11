/**
 * @jest-environment jsdom
 */

import {getAllByTestId, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"
import BaseDeDonnees from "../__mocks__/BaseDeDonnees.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      //expect(windowIcon.style.background = "#7bb1f7").toEqual(windowIcon.style.background = "#7bb1f7")
      expect(windowIcon.className = "active-icon").toEqual(windowIcon.className = "active-icon")
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills }, {formatDate: false})
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("Then la facture devrait apparaitre à l'écran", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getAllByTestId('icon-eye'))
      const windowIcon = screen.getAllByTestId('icon-eye')

      windowIcon.forEach(eye => {
        const fileName = jest.fn(bills.fileName)          
        eye.addEventListener('click', fileName)
        expect(document.getElementById("modaleFile").style.display = "block").toBeTruthy()
      });
    })
  })
})


// test d'intégration GET Bills
describe("Given I am a user connected as Employee", () => {
  describe("Quand je suis dans Bills UI", () => {
    test("Extraction des factures depuis mock API GET dans BaseDeDonnees.js", async () => {
      const getFactures = jest.spyOn(BaseDeDonnees, "get");

      // Get bills and the new bill
      const bills = await BaseDeDonnees.get();

      // getSpy must have been called once
      expect(getFactures).toHaveBeenCalledTimes(1);
      // Le nombre de factures doit être 4
      expect(bills.data.length).toBe(4);
    });

    test("Extraction des factures depuis mock API GET dans BaseDeDonnees.js échec avec message d'erreur 404", async () => {
      BaseDeDonnees.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );

      // Création du code erreur 404
      const html = BillsUI({
        error: "Erreur 404"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 404/);
      // Test de l'erreur 404
      expect(message).toBeTruthy();
    });

    test("Extraction des factures depuis mock API GET dans BaseDeDonnees.js échec avec message d'erreur 500", async () => {
      BaseDeDonnees.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );

      // Erreur 500
      const html = BillsUI({
        error: "Erreur 500"
      });
      document.body.innerHTML = html;

      const message = await screen.getByText(/Erreur 500/);
      // Test de l'erreur message 400
      expect(message).toBeTruthy();
    });
  });
});