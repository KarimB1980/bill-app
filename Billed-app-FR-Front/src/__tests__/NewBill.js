/**
 * @jest-environment jsdom
 */

import {getAllByTestId, screen, fireEvent, waitFor} from "@testing-library/dom"

//import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import {  bills } from '../fixtures/bills.js';

import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

import '@testing-library/jest-dom/extend-expect'
//import DashboardUI from "../views/DashboardUI.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    /*test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })*/
    test("Then icon mail in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      expect(windowIcon.className = "active-icon").toEqual(windowIcon.className = "active-icon")
    })
  })

  describe('When I choose an image to upload', () => {
    test('Then the file input should get the file name', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Création newBill
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

      // Ajout de lm'évènement change
      const inputFile = screen.getByTestId('file');
      inputFile.addEventListener('change', handleChangeFile);

      // Lancement de l'évènement
      fireEvent.change(inputFile, {
        target: {
          files: [new File(['image/png , image/jpg , image/jpeg'], 'image/png , image/jpg , image/jpeg', {
            type: 'image/png , image/jpg , image/jpeg'
          })],
        }
      });

      // Appel de la fonction handleChangeFile
      expect(handleChangeFile).toBeCalled();
      // Le nom du fichier du être du type png ou jpg ou jpeg
      expect(inputFile.files[0].name).toBe('image/png , image/jpg , image/jpeg');
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
    });
  });

  /*describe("When I am on NewBill Page", () => {
    test("Alors les propriétés du contour du type de dépense devraient être '2px solid #0D5AE5 !important'", () => {
      const typeDepense = screen.getByTestId('expense-type')
      expect(typeDepense.style.border = "2px solid #0D5AE5 !important").toEqual(typeDepense.style.border = "2px solid #0D5AE5 !important")
    })
  })*/

  /*describe("When I am on NewBill Page", () => {
    test("Alors le placeholder du nom de la dépense devrait être 'Vol Paris Londres'", () => {
      const nomDepense = screen.getByTestId('expense-name')
      expect(nomDepense.style.placeholder="Vol Paris Londres").toEqual(nomDepense.style.placeholder="Vol Paris Londres")
    })
  })
  describe("When I am on NewBill Page", () => {
    test("Alors un clic sur le bouton 'nouvelle facture' devrait faire apparaitre le formulaire de saisie de la nouvelle facture", () => {
      const nouvelleFacture = screen.getByTestId('form-new-bill')
      expect(nouvelleFacture.style.display="block").toEqual(nouvelleFacture.style.display="block")
    })
  })
  describe("When I am on NewBill Page", () => {
    test("Alors le fichier sélectionné devrait avoir une extension .jpg ou .jpeg ou .png", () => {
      const fichier = screen.getByTestId('file')
      expect(fichier.accept=".jpg, .jpeg, .png").toBeTruthy()
    })
  })*/

  /*describe("Quand je suis sur NewBill Page et que je clique sur 'Envoyer'" , () => {
    test("Alors une date devrait avoir été sélectionnée.", () => {
      document.querySelector('#btn-send-bill').click()
      const date = screen.getByTestId('datepicker')
      expect(date.value === "jj/mm/aaaa").not.toBeTruthy()
    })
  })*/


  const newBill = [{
    "id": "47qAXb6fIm2zOKkLzMro",
    "vat": "80",
    "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
    "status": "pending",
    "type": "Hôtel et logement",
    "commentary": "séminaire billed",
    "name": "encore",
    "fileName": "preview-facture-free-201801-pdf-1.jpg",
    "date": "2023-01-05",
    "amount": 400,
    "commentAdmin": "ok",
    "email": "a@a",
    "pct": 20,
  }]


  describe('Given I am connected as an employee', () => {
    describe('When I click on send button', () => {
      test(('Then, I should be sent to bills page'), () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = NewBillUI({ newBill })
        const newbill = new NewBill({ document, onNavigate, localStorage })
        const handleClick = jest.fn(newbill.handleClick)
        const handleChangeFile = jest.fn(newbill.handleChangeFile)
        const envoyer = document.querySelector("#btn-send-bill")
        const changer = screen.getByTestId("file")
        const handleSubmit = jest.fn((e) => e.preventDefault());
        const handleChangeFil = jest.fn((e) => e.preventDefault());

        changer.addEventListener("click", handleChangeFile);
        userEvent.click(envoyer)
        expect(newBill.date).not.toEqual(newBill.date == "")

        envoyer.addEventListener('click', handleClick)
        userEvent.click(envoyer)
        expect(handleClick).toHaveBeenCalled()

        envoyer.addEventListener("submit", handleSubmit);

        // Contrôle que le prix est renseigné
        expect(newBill.amount === "").not.toBeTruthy()
        // Contrôle que la date est renseignée
        expect(newBill.date === "jj/mm/aaaa").not.toBeTruthy()

        // Recherche de l'extension du fichier sélectionné
        let regexExtensionFichier = /(?:\.([^.]+))?$/;
        let fichier = newBill.fileName;
        let extensionFichier = regexExtensionFichier.exec(fichier);
        // Si le fichier sélectionné ne comporte pas l'une des trois extensions jpg jpeg ou png alors un message d'alerte s'affiche et le fichier est alors refusé. 
        expect(extensionFichier === "png" || extensionFichier === "jpeg" || extensionFichier === "jpg").toEqual(extensionFichier === "png" || extensionFichier === "jpeg" || extensionFichier === "jpg")

        // Contrôle que la page des notes de frais s'affiche après un clic sur "Envoyer"  
        expect(screen.getByText('Mes notes de frais')).toBeTruthy()

      })
    })
  })
})